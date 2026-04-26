import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load questions from JSON file
const questionsPath = path.join(__dirname, 'questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

function getRandomQuestion() {
  const question = questions[Math.floor(Math.random() * questions.length)];
  return {
    ...question,
    testCaseCount: question.testCases.length
  };
}

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

const io = new Server(httpServer, {
  cors: { 
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

const matchmakingQueue = new Map();
const activeBattles = new Map();
const connectedPlayers = new Map();

// Calculate rating difference for matching
function getRatingDifference(rating1, rating2) {
  return Math.abs(rating1 - rating2);
}

// Find a suitable opponent for a player
function findOpponent(playerRating, excludeUserId) {
  let bestMatch = null;
  let bestDifference = Infinity;
  const maxDifference = 200; // Match with players within ±200 rating

  for (const [userId, player] of matchmakingQueue.entries()) {
    if (userId === excludeUserId) continue;
    
    const difference = getRatingDifference(playerRating, player.rating);
    if (difference <= maxDifference && difference < bestDifference) {
      bestMatch = userId;
      bestDifference = difference;
    }
  }

  return bestMatch;
}

// Create a battle between two players
function createBattle(player1Id, player2Id) {
  const player1 = matchmakingQueue.get(player1Id);
  const player2 = matchmakingQueue.get(player2Id);
  
  if (!player1 || !player2) return null;

  const battleId = uuidv4();
  const question = getRandomQuestion();
  
  const battle = {
    battleId,
    questionId: question.id,
    question: {
      id: question.id,
      title: question.title,
      difficulty: question.difficulty,
      testCaseCount: question.testCaseCount,
      description: question.description,
      examples: question.examples
    },
    player1: {
      userId: player1Id,
      username: player1.username,
      rating: player1.rating,
      socketId: player1.socketId,
    },
    player2: {
      userId: player2Id,
      username: player2.username,
      rating: player2.rating,
      socketId: player2.socketId,
    },
    createdAt: Date.now(),
    status: 'initializing'
  };

  activeBattles.set(battleId, battle);
  
  // Remove from matchmaking queue
  matchmakingQueue.delete(player1Id);
  matchmakingQueue.delete(player2Id);

  return battle;
}

io.on('connection', (socket) => {
  socket.on('join_matchmaking', (playerData) => {
    const { userId, username, rating } = playerData;

    // Add player to queue
    matchmakingQueue.set(userId, {
      userId,
      username,
      rating,
      socketId: socket.id,
      joinedAt: Date.now()
    });

    // Add to connected players
    connectedPlayers.set(userId, {
      userId,
      username,
      rating,
      socketId: socket.id,
      status: 'matchmaking'
    });

    // Try to find an opponent
    const opponentId = findOpponent(rating, userId);
    
    if (opponentId) {
      const battle = createBattle(userId, opponentId);
      
      if (battle) {
        // Notify both players
        io.to(battle.player1.socketId).emit('match_found', {
          battleId: battle.battleId,
          opponent: battle.player2,
          question: battle.question,
          role: 'player1'
        });

        io.to(battle.player2.socketId).emit('match_found', {
          battleId: battle.battleId,
          opponent: battle.player1,
          question: battle.question,
          role: 'player2'
        });

        // Update their status
        connectedPlayers.get(userId).status = 'in_battle';
        connectedPlayers.get(opponentId).status = 'in_battle';
      }
    } else {
      socket.emit('searching', { message: 'Searching for opponent...' });
    }

    // Broadcast updated queue size
    io.emit('queue_updated', { queueSize: matchmakingQueue.size });
  });

  // Player cancels matchmaking
  socket.on('cancel_matchmaking', (userId) => {
    matchmakingQueue.delete(userId);
    connectedPlayers.delete(userId);
    io.emit('queue_updated', { queueSize: matchmakingQueue.size });
  });

  // Battle started - both players confirm they're ready
  socket.on('battle_ready', (battleId) => {
    const battle = activeBattles.get(battleId);
    if (battle) {
      battle.status = 'started';
    }
  });

  // Get battle details (used to retrieve the correct question for both players)
  socket.on('get_battle_details', (data) => {
    const { battleId } = data;
    const battle = activeBattles.get(battleId);
    if (battle) {
      socket.emit('battle_details', {
        battleId,
        question: battle.question
      });
    }
  });

  // Player submits code
  socket.on('code_submitted', (data) => {
    const { battleId, userId, username, testCasesPassed } = data;
    const battle = activeBattles.get(battleId);
    if (battle) {
      // Mark this player as submitted
      if (battle.player1.userId === userId) {
        battle.player1.submitted = true;
        battle.player1.submittedAt = Date.now();
        battle.player1.testCasesPassed = testCasesPassed || 0;
      } else {
        battle.player2.submitted = true;
        battle.player2.submittedAt = Date.now();
        battle.player2.testCasesPassed = testCasesPassed || 0;
      }

      // Notify opponent about submission
      const opponent = battle.player1.userId === userId ? battle.player2 : battle.player1;
      io.to(opponent.socketId).emit('opponent_submitted', {
        username,
        battleId,
        testCasesPassed: testCasesPassed || 0
      });
    }
  });

  // Battle ends
  socket.on('battle_end', (data) => {
    const { battleId, testCasesPassed } = data;
    const battle = activeBattles.get(battleId);
    
    // Only process battle_end once
    if (!battle || battle.status === 'completed') {
      return;
    }
    
    if (battle) {
      battle.status = 'completed';
      
      // Ensure both players have testCasesPassed values
      const player1TestCases = battle.player1.testCasesPassed || 0;
      const player2TestCases = battle.player2.testCasesPassed || 0;
      
      // Determine winner based on test cases passed
      let actualWinnerId = null;
      
      if (player1TestCases > player2TestCases) {
        actualWinnerId = battle.player1.userId;
      } else if (player2TestCases > player1TestCases) {
        actualWinnerId = battle.player2.userId;
      } else if (player1TestCases === player2TestCases && player1TestCases > 0) {
        // If both have same test cases, winner is who submitted first
        if (battle.player1.submitted && battle.player2.submitted) {
          actualWinnerId = battle.player1.submittedAt < battle.player2.submittedAt 
            ? battle.player1.userId 
            : battle.player2.userId;
        } else if (battle.player1.submitted) {
          actualWinnerId = battle.player1.userId;
        } else if (battle.player2.submitted) {
          actualWinnerId = battle.player2.userId;
        }
      } else {
        // No one has passed any test cases - whoever submitted first
        if (battle.player1.submitted && battle.player2.submitted) {
          actualWinnerId = battle.player1.submittedAt < battle.player2.submittedAt 
            ? battle.player1.userId 
            : battle.player2.userId;
        } else if (battle.player1.submitted) {
          actualWinnerId = battle.player1.userId;
        } else if (battle.player2.submitted) {
          actualWinnerId = battle.player2.userId;
        }
      }
      
      battle.winnerId = actualWinnerId;
      
      // Notify both players with results
      io.to(battle.player1.socketId).emit('battle_result', {
        battleId,
        winnerId: actualWinnerId,
        yourId: battle.player1.userId,
        yourTestCases: player1TestCases,
        opponentTestCases: player2TestCases,
        opponent: battle.player2,
        isWin: battle.player1.userId === actualWinnerId
      });
      io.to(battle.player2.socketId).emit('battle_result', {
        battleId,
        winnerId: actualWinnerId,
        yourId: battle.player2.userId,
        yourTestCases: player2TestCases,
        opponentTestCases: player1TestCases,
        opponent: battle.player1,
        isWin: battle.player2.userId === actualWinnerId
      });

      // Clean up after 5 seconds
      setTimeout(() => {
        activeBattles.delete(battleId);
      }, 5000);
    }
  });

  // Get online players count
  socket.on('get_stats', () => {
    socket.emit('stats', {
      onlinePlayers: connectedPlayers.size,
      inQueue: matchmakingQueue.size,
      activeBattles: activeBattles.size
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    
    // Remove from queue and connected players
    for (const [userId, player] of matchmakingQueue.entries()) {
      if (player.socketId === socket.id) {
        matchmakingQueue.delete(userId);
      }
    }
    
    for (const [userId, player] of connectedPlayers.entries()) {
      if (player.socketId === socket.id) {
        connectedPlayers.delete(userId);
      }
    }

    io.emit('queue_updated', { queueSize: matchmakingQueue.size });
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    onlinePlayers: connectedPlayers.size,
    playersInQueue: matchmakingQueue.size,
    activeBattles: activeBattles.size,
    totalBattles: activeBattles.size + Math.random() * 100 // Mock data
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
