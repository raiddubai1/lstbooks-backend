# 🚀 Render.com Deployment Guide for lstBooks Backend

## ✅ Pre-Deployment Checklist

All the following have been completed:

- ✅ `dotenv` imported and configured in `server.js`
- ✅ MongoDB connection uses `process.env.MONGO_URI`
- ✅ `package.json` has `"start": "node server.js"` script
- ✅ `.gitignore` includes `.env` file
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ `.env` file updated with placeholder for MongoDB Atlas URI

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Update Your .env File with MongoDB Atlas URI

1. Open `/Volumes/SallnyHD/lstBooks/backend/.env`
2. Replace `<paste-your-MongoDB-Atlas-URI-here>` with your actual MongoDB Atlas connection string
3. Example:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lstbooks?retryWrites=true&w=majority
   ```
4. Save the file (this is for local testing only - it won't be committed to git)

---

### Step 2: Create a GitHub Repository

1. **Go to GitHub** (https://github.com)
2. **Click** the "+" icon in the top right → "New repository"
3. **Repository name**: `lstbooks-backend` (or your preferred name)
4. **Description**: "Backend API for lstBooks - Dental Students Learning Platform"
5. **Visibility**: Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. **Click** "Create repository"

---

### Step 3: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Volumes/SallnyHD/lstBooks/backend

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/lstbooks-backend.git

# Rename branch to main (optional but recommended)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/lstbooks-backend.git
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub credentials. If you have 2FA enabled, you'll need to use a Personal Access Token instead of your password.

---

### Step 4: Deploy to Render.com

#### 4.1 Create Render Account
1. Go to https://render.com
2. Sign up or log in (you can use your GitHub account)

#### 4.2 Create New Web Service
1. Click **"New +"** button in the top right
2. Select **"Web Service"**
3. Click **"Connect account"** to connect your GitHub account (if not already connected)
4. Find and select your **`lstbooks-backend`** repository
5. Click **"Connect"**

#### 4.3 Configure Web Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `lstbooks-backend` (or your preferred name) |
| **Region** | Choose closest to your users (e.g., Oregon, Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | Leave blank (or `.` if required) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or paid plan if needed) |

#### 4.4 Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**

Add the following variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string (e.g., generate with `openssl rand -base64 32`) |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render uses this by default) |

**Example MONGO_URI:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lstbooks?retryWrites=true&w=majority
```

**To generate a secure JWT_SECRET**, run this in your terminal:
```bash
openssl rand -base64 32
```

#### 4.5 Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
3. Wait for deployment to complete (usually 2-5 minutes)

---

### Step 5: Verify Deployment

Once deployed, Render will provide you with a URL like:
```
https://lstbooks-backend.onrender.com
```

**Test your API:**

1. **Health Check:**
   ```bash
   curl https://lstbooks-backend.onrender.com/api/health
   ```
   
   Expected response:
   ```json
   {"status":"ok","message":"lstBooks API is running"}
   ```

2. **Get Subjects:**
   ```bash
   curl https://lstbooks-backend.onrender.com/api/subjects
   ```

3. **Get Quizzes:**
   ```bash
   curl https://lstbooks-backend.onrender.com/api/quizzes
   ```

---

### Step 6: Update Frontend to Use Deployed Backend

1. Open `/Volumes/SallnyHD/lstBooks/frontend/.env` (or create it)
2. Add:
   ```
   VITE_API_URL=https://lstbooks-backend.onrender.com/api
   ```
3. Restart your frontend dev server

---

## 🔄 Making Updates After Deployment

Whenever you make changes to your backend:

```bash
cd /Volumes/SallnyHD/lstBooks/backend

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

Render will **automatically detect the push** and redeploy your application!

---

## 🐛 Troubleshooting

### Issue: "Application failed to respond"
- Check Render logs (click "Logs" tab in Render dashboard)
- Verify `MONGO_URI` is correct in environment variables
- Ensure MongoDB Atlas allows connections from anywhere (IP: `0.0.0.0/0`)

### Issue: "Cannot connect to MongoDB"
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
4. Save

### Issue: "Module not found"
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Check Render build logs for errors

### Issue: "Port already in use"
- Render automatically sets the PORT environment variable
- Your code already uses `process.env.PORT || 5000` ✅

---

## 📊 Monitoring Your Deployment

### Render Dashboard
- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory usage
- **Events**: Deployment history
- **Settings**: Update environment variables

### MongoDB Atlas
- **Metrics**: Database performance
- **Network Access**: Manage IP whitelist
- **Database Access**: Manage users

---

## 💰 Free Tier Limitations

Render's free tier includes:
- ✅ 750 hours/month (enough for 1 service running 24/7)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ⚠️ Spins down after 15 minutes of inactivity (first request may be slow)
- ⚠️ 512 MB RAM

**To prevent spin-down** (paid plans only):
- Upgrade to Starter plan ($7/month)

---

## 🎉 Success!

Your lstBooks backend is now deployed and accessible at:
```
https://lstbooks-backend.onrender.com/api
```

**Next Steps:**
1. Seed your production database (run seed scripts with production MONGO_URI)
2. Deploy your frontend (Vercel, Netlify, or Render)
3. Update frontend to use production backend URL
4. Test all features in production

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **lstBooks Issues**: Create an issue in your GitHub repository

---

**Deployment Complete! 🚀**

