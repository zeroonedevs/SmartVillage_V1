# GOP Deployment Setup Guide (MongoDB + Cloudflare R2)

## Problem

Your deployed website can't access the database because `MONGODB_URI` and R2 credentials aren't set on the server.

## Solution: 2 Steps

### Step 1: Add Environment Variables to Your Deployment Platform

You need to add these variables to your deployment platform (Vercel/Netlify/etc):

#### Environment Variables:

```env
# MongoDB Connection String
MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/your_db_name?retryWrites=true&w=majority

# Cloudflare R2 Storage
R2_ACCOUNT_ID = your_r2_account_id
R2_ACCESS_KEY_ID = your_r2_access_key_id
R2_SECRET_ACCESS_KEY = your_r2_secret_access_key
R2_BUCKET_NAME = your_bucket_name

# Admin Initialization Secret
ADMIN_INIT_SECRET = svr-kluniversity-2026
```

#### For Vercel:

1. Go to your project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add the variables listed above
4. Click **Save**
5. **Redeploy** your application

#### For Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add the same variables as above
3. **Redeploy**

### Step 2: Initialize Admin Account (One-Time)

After deployment, call this endpoint ONCE to create the admin account in MongoDB:

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

---

## Quick Checklist

- [ ] Add `MONGODB_URI` and R2 variables to deployment platform
- [ ] Add `ADMIN_INIT_SECRET` to deployment platform
- [ ] Redeploy the application
- [ ] Call `/api/gop/init-admin` endpoint once
- [ ] Test login at `/GOP/Login`
- [ ] Test GOP registration at `/GOP`

---

## Troubleshooting

**500 Error on login:**

- Check that `MONGODB_URI` is set correctly in your deployment platform
- Ensure your MongoDB Atlas Network Access allows connections from your deployment platform (0.0.0.0/0)

**R2 Upload Fails:**

- Check R2 credentials in environment variables
- Ensure your R2 bucket exists

**Admin initialization fails:**

- Check that the secret matches: `svr-kluniversity-2026`
- Check deployment logs for errors

---

## Security Notes

✅ The init endpoint is protected by a secret key  
✅ Credentials are hashed with bcrypt  
✅ Safe to commit to GitHub

After initialization, you can optionally delete the `/api/gop/init-admin` endpoint for extra security.
