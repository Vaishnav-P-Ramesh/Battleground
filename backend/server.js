import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

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
  const battle = {
    battleId,
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
      const battle = createBattle(userId, opponentId);
      
      if (battle) {
        // Notify both players
        io.to(battle.player1.socketId).emit('match_found', {
          battleId: battle.battleId,
          opponent: battle.player2,
          role: 'player1'
        });

        io.to(battle.player2.socketId).emit('match_found', {
          battleId: battle.battleId,
          opponent: battle.player1,
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

  // Player submits code
  socket.on('code_submitted', (data) => {
    const { battleId, userId, username } = data;
    const battle = activeBattles.get(battleId);
    if (battle) {
      // Notify opponent
      const opponent = battle.player1.userId === userId ? battle.player2 : battle.player1;
      io.to(opponent.socketId).emit('opponent_submitted', {
        username,
        battleId
      });
    }
  });

  // Battle ends
  socket.on('battle_end', (data) => {
    const { battleId, winnerId } = data;
    const battle = activeBattles.get(battleId);
    if (battle) {
      battle.status = 'completed';
      battle.winnerId = winnerId;
      
      // Notify both players with results
      io.to(battle.player1.socketId).emit('battle_result', {
        battleId,
        winnerId,
        yourId: battle.player1.userId
      });
      io.to(battle.player2.socketId).emit('battle_result', {
        battleId,
        winnerId,
        yourId: battle.player2.userId
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
