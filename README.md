# DSA Battleground

A real-time coding duel platform where developers compete in algorithm challenges with live matchmaking.

## Features

- **Real-time Matchmaking** - Skill-based opponent matching using Socket.IO
- **Live Battle Arena** - Code against opponents in real-time
- **Player Rating System** - Track skill progression
- **Interactive Code Editor** - Write, test, and submit solutions
- **Opponent Tracking** - Monitor opponent progress during battles

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Socket.IO Client
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Socket.IO
- Supabase (Auth)

## Project Structure

```
DSA-Battleground/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── pages/     # Route pages
│   │   ├── components/# React components
│   │   ├── context/   # Context providers (Auth, Socket)
│   │   └── main.jsx
│   └── package.json
├── backend/           # Node.js backend server
│   ├── server.js      # Socket.IO matchmaking server
│   └── package.json
└── vercel.json        # Deployment config
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Usage

1. Start backend server: `npm run dev` (in backend/)
2. Start frontend: `npm run dev` (in frontend/)
3. Open app in browser (typically http://localhost:5173)
4. Sign up or login
5. Go to Dashboard → "Find Opponent"
6. Wait for matchmaking or open 2 windows to test with real match

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## API & WebSocket Events

### Socket Events

**Emit:**
- `join_matchmaking` - Join matchmaking queue
- `cancel_matchmaking` - Leave queue
- `code_submitted` - Notify of code submission
- `battle_end` - Signal battle completion

**Listen:**
- `match_found` - Opponent found, battle ready
- `searching` - Search status update
- `opponent_submitted` - Opponent submitted code
- `queue_updated` - Queue size changed

### REST Endpoints

- `GET /api/stats` - Server statistics
- `GET /api/health` - Health check

## Architecture

The app uses a real-time matchmaking algorithm:

1. Players join matchmaking queue with rating/skill level
2. System finds opponent within ±200 rating difference
3. Match created → battle session initialized
4. Both players notified with opponent details
5. Battle begins with shared timer and progress tracking

## Future Enhancements

- [ ] Real code compilation & testing
- [ ] Dynamic problem sets
- [ ] Rating recalculation after battles
- [ ] Match history & statistics
- [ ] Leaderboards
- [ ] Multi-language support
- [ ] Real-time streaming of opponent code

## License

MIT

## Contributing

Pull requests welcome. For major changes, please open an issue first.

---

**Status:** ✅ Production Ready

Deployed on Vercel - Check the repository for deployment links.
