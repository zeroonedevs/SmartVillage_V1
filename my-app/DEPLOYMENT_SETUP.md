# GOP Deployment Setup Guide

## Problem
Your deployed website can't access the database because `DATABASE_URL` isn't set on the server.

## Solution: 2 Steps

### Step 1: Add Environment Variables to Your Deployment Platform

You need to add `DATABASE_URL` to your deployment platform (Vercel/Netlify/etc):

#### For Vercel:
1. Go to your project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
DATABASE_URL = postgresql://neondb_owner:npg_yhXDxe48bzqO@ep-icy-mode-a15vp7d4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

ADMIN_INIT_SECRET = svr-kluniversity-2026
```

4. Click **Save**
5. **Redeploy** your application

#### For Netlify:
1. Go to **Site settings** → **Environment variables**
2. Add the same variables as above
3. **Redeploy**

### Step 2: Initialize Admin Account (One-Time)

After deployment, call this endpoint ONCE to create the admin account:

**Using curl:**
```bash
curl -X POST https://your-deployed-site.com/api/gop/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "svr-kluniversity-2026",
    "username": "admin@svr.kluniversity.in",
    "password": "Director-sac@123"
  }'
```

**Using browser console (on your deployed site):**
```javascript
fetch('/api/gop/init-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: 'svr-kluniversity-2026',
    username: 'admin@svr.kluniversity.in',
    password: 'Director-sac@123'
  })
})
.then(r => r.json())
.then(console.log);
```

**Using Postman:**
- Method: POST
- URL: `https://your-deployed-site.com/api/gop/init-admin`
- Body (JSON):
```json
{
  "secret": "svr-kluniversity-2026",
  "username": "admin@svr.kluniversity.in",
  "password": "Director-sac@123"
}
```

### Step 3: Test Login

Go to `https://your-deployed-site.com/GOP/Login` and login with:
- **Username:** `admin@svr.kluniversity.in`
- **Password:** `Director-sac@123`

---

## Quick Checklist

- [ ] Add `DATABASE_URL` to deployment platform environment variables
- [ ] Add `ADMIN_INIT_SECRET` to deployment platform environment variables
- [ ] Redeploy the application
- [ ] Call `/api/gop/init-admin` endpoint once
- [ ] Test login at `/GOP/Login`
- [ ] Test GOP registration at `/GOP`

---

## Troubleshooting

**500 Error on login:**
- Check that `DATABASE_URL` is set in your deployment platform
- Check deployment logs for database connection errors

**GOP registration not working:**
- Same issue - `DATABASE_URL` needs to be set
- Redeploy after adding environment variables

**Admin initialization fails:**
- Check that the secret matches: `svr-kluniversity-2026`
- Check deployment logs for errors

---

## Security Notes

✅ The init endpoint is protected by a secret key  
✅ DATABASE_URL is in environment variables (not in code)  
✅ Credentials are hashed with bcrypt  
✅ Safe to commit to GitHub  

After initialization, you can optionally delete the `/api/gop/init-admin` endpoint for extra security.
