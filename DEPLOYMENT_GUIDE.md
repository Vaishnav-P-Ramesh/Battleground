# Deployment Guide - Render Backend

## Backend Deployment on Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize the app

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select repository: `Vaishnav-P-Ramesh/Battleground`
4. Choose branch: `main`

### Step 3: Configure Web Service

**Name:** `dsa-battleground-backend`

**Environment:**
- Runtime: `Node`
- Region: Choose closest to you

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node server.js
```

**Environment Variables:**
- `FRONTEND_URL` = (your Vercel frontend URL, e.g., `https://battleground.vercel.app`)
- `NODE_ENV` = `production`

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. You'll get a URL like: `https://dsa-battleground-backend.onrender.com`
4. Copy this URL

### Step 5: Update Frontend

#### Option A: Environment Variable (Recommended)
1. In your Vercel dashboard
2. Go to Settings → Environment Variables
3. Add: `VITE_BACKEND_URL` = `https://dsa-battleground-backend.onrender.com`
4. Redeploy frontend

#### Option B: Update .env.local
```bash
cd frontend
echo "VITE_BACKEND_URL=https://dsa-battleground-backend.onrender.com" > .env.local
npm run build
```

### Step 6: Update Backend CORS

Once you have your Vercel frontend URL, update Render environment:
1. Go to Render dashboard
2. Select your service
3. Click **"Environment"**
4. Update `FRONTEND_URL` with your Vercel URL

---

## Frontend Deployment on Vercel

### Step 1: Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"** → Import your repo
3. Select `frontend` as root directory
4. Environment variable:
   - `VITE_BACKEND_URL` = `https://dsa-battleground-backend.onrender.com`

### Step 2: Deploy
Click **"Deploy"** - Vercel will build and deploy automatically

---

## Environment Variables Checklist

### Render Backend
- [ ] `FRONTEND_URL` = Your Vercel app URL
- [ ] `NODE_ENV` = `production`

### Vercel Frontend
- [ ] `VITE_BACKEND_URL` = Your Render app URL

---

## Testing Deployment

### Test Backend
```bash
curl https://dsa-battleground-backend.onrender.com/api/health
```

Should return:
```json
{"status":"OK","timestamp":"..."}
```

### Test Frontend Connection
1. Open your Vercel app
2. Sign up/Login
3. Click "Find Opponent"
4. Check browser console for connection logs
5. Should see WebSocket connection established

---

## Troubleshooting

### WebSocket Connection Failed
- Check `FRONTEND_URL` in Render environment variables
- Ensure it matches your Vercel URL exactly (including protocol)
- Restart Render service

### CORS Errors
- Verify `FRONTEND_URL` is correctly set
- Check browser console for exact error
- Make sure trailing slashes are consistent

### Build Failures
- Check Render logs: Dashboard → Your Service → Logs
- Ensure all dependencies are in package.json
- Check Node version (18+ recommended)

### Cold Starts
- Render may take 30-60 seconds on first request after inactivity
- This is normal for free tier
- Upgrade to paid for faster response

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://battleground.vercel.app |
| Backend | https://dsa-battleground-backend.onrender.com |

(Replace with your actual URLs)

---

## Next Steps

1. Test matchmaking with 2 browser windows
2. Monitor Render logs for any errors
3. Set up custom domain (optional)
4. Configure auto-deploys for future pushes

---

**Happy deploying!** 🚀
