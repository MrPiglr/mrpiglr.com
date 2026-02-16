# Railway Deployment Guide

## How It Works

1. **Build Step**: `npm run build` creates optimized production files in `dist/`
2. **Server**: `npm start` runs `server.js` - a Node.js Express server that:
   - Serves static files from `dist/`
   - Handles SPA routing (all routes → index.html)
   - Listens on Railway's `$PORT` (8079)

## Environment Variables Required

Set these in Railway's **Variables** section:

```
VITE_SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZGVpc293aHRzYWxzZWtrenFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3Mzc2NTIsImV4cCI6MjA2OTMxMzY1Mn0.2mvk-rDZnHOzdx6Cgcysh51a3cflOlRWO6OA1Z5YWuQ
VITE_HOSTINGER_STORE_ID=store_01K4W00XD897YKNJ9TQXEGQQYX
VITE_APP_URL=https://mrpiglr.com
NODE_ENV=production
```

## How to Deploy

1. **Connect GitHub** to Railway
2. **Select this repository**
3. **Go to Variables tab** and paste the environment variables above
4. **Click Deploy** - Railway will auto-build and start

## Troubleshooting

### Still 502 errors?
1. Check Railway **Deployments** → **Logs** for actual error message
2. Verify all VITE_* variables are set in Railway Variables tab
3. Check build succeeded (look for "✅ Built successfully" in logs)

### Logs say "dist folder not found"?
- Build failed. Check "Build Logs" in Railway Deployments tab

### App loads but broken styling/routes?
- Make sure `npm run build` created the dist folder
- Check that all VITE_* variables are set (they're needed at build time)

## Local Testing

```bash
# Build for testing
npm run build

# Test server locally (on port 8079)
npm start

# Then visit http://localhost:8079
```

## Files

- `server.js` - Production Node.js/Express server
- `railway.json` - Railway platform config
- `.env.local` - Your local credentials (not committed)

