# Railway Deployment Guide

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

## Troubleshooting 502 Errors

- ✅ Environment variables set? (check Variables tab)
- ✅ Build succeeded? (check Deployments tab)
- ✅ Logs show no errors? (check Logs tab)
- ✅ Port configured? (should be auto via `$PORT` env var)

If still getting 502:
1. Check **Logs** for actual error
2. Clear cache and redeploy
3. Ensure Node version is 18+
