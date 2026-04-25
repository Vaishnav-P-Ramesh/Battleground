# 🎮 Matchmaking System - Testing & Usage Guide

## What's New?

Your app now has a **real-time matchmaking system** where players can:
- Click "Play Now" to join a matchmaking queue
- Get matched with other online players
- See opponent details before battle
- Start a real battle together

## 🚀 How to Run

### Step 1: Install Dependencies

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

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🎮 DSA Battleground Server running on port 5000
📍 WebSocket endpoint: ws://localhost:5000
```

### Step 3: Start Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

Open the app (usually `http://localhost:5173`)

## 🧪 Testing Matchmaking

### Single Player Test (with fallback opponent)
1. Open the app
2. Go to Dashboard
3. Click "Find Opponent" or "Play Now"
4. You'll join the queue
5. After 5 seconds, you'll see a fallback opponent
6. Click "Battle" to start

### Real 2-Player Test
1. **Open 2 separate browser windows:**
   - Window 1: `http://localhost:5173` (Normal)
   - Window 2: `http://localhost:5173` (Private/Incognito mode)

2. **In BOTH windows:**
   - Sign up with different email addresses (or use same if testing with clear cache)
   - Go to Dashboard
   - Click "Find Opponent"

3. **When Player 2 joins the queue:**
   - The server matches them
   - Both see "MATCH FOUND"
   - Both see opponent's name and rating
   - Countdown starts (3 seconds)
   - Redirects to battle page

4. **On Battle page:**
   - Both see each other's usernames
   - Both see opponent avatars
   - Can test Run/Submit buttons
   - Opponent progress simulates in real-time

## 📊 System Architecture

```
Frontend App
    ↓
SocketContext (Socket.IO client)
    ↓ (connects to)
Backend Server (Socket.IO)
    ↓
Matchmaking Queue Logic
    ↓
Battle Management
```

## 🔄 Matchmaking Flow

```
Player 1                    Server                    Player 2
  Joins ─────────────────────→ [Queue: 1]
  Waiting                                          
                                                    ← Joins
                                                      [Queue: 2]
  ←─────── Match Found ─────────────────────→ Match Found
  
  Sees: CodeNinja (1520 rating)    Sees: Player_01 (1500 rating)
  
  ←──── Navigate to Battle ────→ Navigate to Battle
  
  Battle Page                   Battle Page
  (with live opponent data)     (with live opponent data)
```

## 🎯 Key Features

✅ **Real-Time Matching** - Uses Socket.IO for instant updates
✅ **Skill-Based Matching** - Matches within ±200 rating difference
✅ **Live Opponent Data** - See opponent details before battle
✅ **Auto Cleanup** - Battles cleaned up automatically
✅ **Queue Management** - Automatic removal when disconnected
✅ **Status Updates** - Real-time queue and player status

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot connect to server" | Make sure backend is running on port 5000 |
| Players don't match | Open 2 separate windows; check ratings |
| Opponent name shows as undefined | Reload browser; check Socket connection |
| Stuck on "Searching" screen | Click Cancel and try again |

## 📝 Files Modified/Created

### Backend
- ✅ `server.js` - Main matchmaking server
- ✅ `package.json` - Added socket.io and uuid
- ✅ `MATCHMAKING_SETUP.md` - Detailed setup guide

### Frontend
- ✅ `src/context/SocketContext.jsx` - Socket.IO setup
- ✅ `src/pages/App.jsx` - Added SocketProvider
- ✅ `src/pages/Matchmaking.jsx` - Real matchmaking logic
- ✅ `src/pages/Battle.jsx` - Updated with opponent data
- ✅ `package.json` - Added socket.io-client
- ✅ `src/utils/mockPlayers.js` - Mock data for testing

## 🔧 Advanced Options

### Change Backend Port
In `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3000;  // Change 5000 to 3000
```

Also update `frontend/src/context/SocketContext.jsx`:
```javascript
const newSocket = io('http://localhost:3000', {  // Change port
```

### Adjust Matching Range
In `backend/server.js`, find `getRatingDifference()`:
```javascript
const maxDifference = 100;  // Was 200, now stricter matching
```

### Test with Mock Data
Use the mock players in `src/utils/mockPlayers.js`:
```javascript
import { getRandomPlayer } from '../utils/mockPlayers';
const player = getRandomPlayer();
```

## 📚 Next Steps

1. **Add persistence**: Save player data to Supabase
2. **Implement code execution**: Actually run submitted code
3. **Update ratings**: Change rating based on battle results
4. **Add battle history**: Save and display past matches
5. **Real-time battle events**: Track opponent progress in real-time

## 💡 Tips

- Use browser DevTools Network tab to see Socket.IO messages
- Console shows all Socket.IO connection events
- Open 2 terminals: one for backend, one for frontend
- Test with different rating players to verify matching

## 🎬 Demo Script

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev

# Terminal 2: Start Frontend  
cd frontend
npm install
npm run dev

# Then:
# 1. Open http://localhost:5173 in 2 browser windows
# 2. Sign up in both (different emails)
# 3. Click "Find Opponent" in both
# 4. Watch them match and go to battle!
```

---

**Congratulations!** Your DSA Battleground now has real matchmaking! 🎉
