# 🚀 Deployment Guide for Bloodzy

This guide will help you deploy Bloodzy frontend on Vercel and backend on Render.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- MongoDB Atlas account (free tier works)

---

## 📍 Backend Deployment on Render

### Step 1: Prepare Backend for Render

1. **Ensure your backend is ready:**
   - Make sure `backend/index.js` uses `process.env.PORT`
   - CORS is properly configured
   - `.env.example` exists

### Step 2: Push Backend to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/bloodzy.git
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `bloodzy-api` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (important!)

### Step 4: Configure Environment Variables on Render

In Render dashboard → Environment Variables, add:

```bash
NODE_ENV=production

# Your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodzy?retryWrites=true&w=majority

# Your frontend URL (from Vercel deployment)
CLIENT_URL=https://your-app.vercel.app

# Generate a strong JWT secret
JWT_SECRET=your_strong_random_secret_key_here

# Email configuration for production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Bloodzy Support <your-email@gmail.com>"

# Mailtrap for development (optional, keep for testing)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
```

**Important**: Render will automatically set `PORT` environment variable - you don't need to add it.

### Step 5: Get Your Backend URL

After deployment, Render will give you a URL like:
```
https://bloodzy-api.onrender.com
```

Copy this URL - you'll need it for the frontend!

---

## 🌐 Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Vercel

1. **Create production `.env` file:**

Create `frontend/.env.production` (or `.env.local`):

```bash
VITE_SERVER_URL=https://bloodzy-api.onrender.com
```

Replace `https://bloodzy-api.onrender.com` with your actual Render backend URL.

### Step 2: Push Frontend to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
# If backend is already pushed, just add frontend files
cd ..
git add frontend/
git commit -m "Add frontend"
git push
```

### Step 3: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4: Configure Environment Variables on Vercel

In Vercel → Project Settings → Environment Variables:

```bash
VITE_SERVER_URL=https://bloodzy-api.onrender.com
```

Replace with your actual Render backend URL.

### Step 5: Redeploy

After adding environment variables, Vercel will automatically redeploy. If not, go to **Deployments** → **Redeploy**.

---

## ✅ Verification

### Test Backend

1. Health check: `https://bloodzy-api.onrender.com/health`
2. Should return: `{"status":"OK","timestamp":"..."}`

### Test Frontend

1. Visit your Vercel URL
2. Try to register/login
3. Check browser console for any CORS errors

### Common Issues

#### CORS Error Still Occurs

1. **Check backend CORS config:**
   - Ensure `CLIENT_URL` in Render matches your Vercel URL exactly
   - Don't include trailing slash
   - Use `https://` not `http://`

2. **Check frontend API calls:**
   - Ensure `VITE_SERVER_URL` in Vercel matches your Render backend URL
   - Rebuild/redeploy after changing env vars

#### Email Not Working

1. **For production emails:**
   - Use Gmail App Password (not regular password)
   - Or use a service like SendGrid, Mailgun

2. **Enable Gmail App Password:**
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use that password in `EMAIL_PASS`

#### Render Web Service Sleeping

- Free tier services sleep after 15 minutes of inactivity
- First request will take ~30 seconds to wake up
- Consider upgrading to paid plan or use a service like Uptime Robot to ping your service

---

## 🔒 Security Checklist

- [ ] Strong `JWT_SECRET` (random 32+ character string)
- [ ] MongoDB Atlas IP whitelist configured (allow all 0.0.0.0/0 for Render IPs)
- [ ] Environment variables set on both platforms
- [ ] No hardcoded credentials in code
- [ ] `.env` files in `.gitignore`
- [ ] Production email service configured
- [ ] CORS only allows your frontend URL

---

## 📝 Additional Notes

- Render free tier services **sleep after 15 minutes** - first request after sleep takes ~30s
- Vercel has automatic SSL certificates
- Render provides SSL certificates automatically
- MongoDB Atlas free tier: 512 MB storage
- Consider adding rate limiting for production
- Monitor logs on both platforms

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

Happy deploying! 🎉

