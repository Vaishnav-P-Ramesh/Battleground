# 🎮 DSA Battleground - Matchmaking Setup Guide

## System Overview

This matchmaking system allows players to:
1. **Join a matchmaking queue** when they click "Play Now"
2. **Get matched** with another online player of similar skill level
3. **Start a real-time battle** with live opponent tracking

The system uses **Socket.IO** for real-time bidirectional communication between frontend and backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
🎮 DSA Battleground Server running on port 5000
📍 WebSocket endpoint: ws://localhost:5000
📍 REST API: http://localhost:5000
```

### 3. Start the Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:5173` (or the port Vite assigns)

### 4. Test Matchmaking

**To test with 2 players:**

1. Open 2 browser windows/tabs:
   - Window 1: `http://localhost:5173`
   - Window 2: `http://localhost:5173` (in private/incognito mode to avoid auth cache)

2. In both windows:
   - Sign up with different emails or login
   - Go to Dashboard → Click "Find Opponent" or "Play Now"

3. Both players will join the matchmaking queue
   - When the 2nd player joins, they'll be matched
   - Both see "MATCH FOUND" with opponent details
   - Countdown starts and they're taken to battle page

## 🔧 How Matchmaking Works

### Algorithm
- Players join a queue with their `userId`, `username`, and `rating`
- When a new player joins, system searches for best match:
  - Matches with players within **±200 rating difference**
  - Picks the closest match
  - Creates a battle between them

### Rating System
- Each player has a rating (default: 1500)
- System tries to match similar-rated players
- More balanced matches = better experience

### Events Flow

```
Player 1                    Backend                   Player 2
    |                          |                           |
    |---join_matchmaking------->|                           |
    |                       [Queue: 1]                      |
    |<----- searching ----------|                           |
    |                          |                           |
    |                          |<-----join_matchmaking-----
    |                          |                    [Found match!]
    |<----match_found---------|-------match_found-------->|
    |     (opponent data)       |     (opponent data)       |
    |                      [Battle created]                |
    |--------navigate to battle------->battle<---------|
```

## 📊 Server API

### Socket.IO Events

**Emit (Client → Server):**
- `join_matchmaking` - Join the queue
- `cancel_matchmaking` - Leave the queue
- `code_submitted` - Player submitted code
- `battle_end` - Battle finished
- `battle_ready` - Both players ready
- `get_stats` - Request server statistics

**Listen (Server → Client):**
- `match_found` - Opponent found, battle ready
- `searching` - Update on search status
- `opponent_submitted` - Opponent submitted code
- `battle_result` - Battle result
- `queue_updated` - Queue size updated
- `stats` - Server statistics

### REST Endpoints

- `GET /api/stats` - Get server statistics
- `GET /api/health` - Health check

## 🐛 Troubleshooting

### "Connection refused" error
- Make sure backend is running (`npm run dev` in backend/)
- Check if port 5000 is available
- Firewall might be blocking WebSocket

### Players not matching
- Make sure both players' ratings are within ±200 of each other
- Check browser console for Socket.IO errors
- Reload page if stuck

### Opponent data not showing
- Make sure you're opening 2 separate windows/tabs
- Incognito/Private mode helps with session separation

## 📝 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Main server with Socket.IO and matchmaking logic |
| `frontend/src/context/SocketContext.jsx` | Socket.IO client setup and context |
| `frontend/src/pages/Matchmaking.jsx` | Matchmaking queue UI |
| `frontend/src/pages/Battle.jsx` | Battle page with opponent tracking |

## 🎯 Next Steps

1. **Login System**: Integrate with Supabase to persist user ratings
2. **Code Execution**: Implement actual code compilation/testing
3. **Rating System**: Update player ratings based on battle results
4. **Match History**: Save and display past matches
5. **Notifications**: Real-time updates during battle (opponent progress, etc.)

## 💡 Tips for Development

- Use Chrome DevTools Network tab to monitor Socket.IO connections
- Browser console shows all Socket.IO events
- Keep 2 terminals open: one for backend, one for frontend
- Test with multiple players to verify real-time functionality

---

**Need help?** Check the Socket.IO documentation: https://socket.io/docs/
