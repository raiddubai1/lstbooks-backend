# ⚡ Quick Deployment Reference

## 🎯 TL;DR - Deploy in 5 Minutes

### 1️⃣ Update .env (Local Testing)
```bash
# Edit backend/.env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lstbooks
```

### 2️⃣ Create GitHub Repo
- Go to https://github.com/new
- Name: `lstbooks-backend`
- Don't initialize with anything
- Click "Create repository"

### 3️⃣ Push to GitHub
```bash
cd /Volumes/SallnyHD/lstBooks/backend
git remote add origin https://github.com/YOUR_USERNAME/lstbooks-backend.git
git branch -M main
git push -u origin main
```

### 4️⃣ Deploy on Render
1. Go to https://render.com
2. New + → Web Service
3. Connect GitHub repo: `lstbooks-backend`
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Random secure string
   - `NODE_ENV`: `production`
6. Click "Create Web Service"

### 5️⃣ Test
```bash
curl https://your-app.onrender.com/api/health
```

---

## 🔑 Environment Variables for Render

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lstbooks?retryWrites=true&w=majority
JWT_SECRET=<run: openssl rand -base64 32>
NODE_ENV=production
PORT=10000
```

---

## 🔄 Update Deployed App

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render auto-deploys! ✨

---

## ✅ Pre-Deployment Checklist

All completed:
- ✅ `server.js` uses `process.env.MONGO_URI`
- ✅ `package.json` has `"start": "node server.js"`
- ✅ `.gitignore` includes `.env`
- ✅ Git initialized and committed
- ✅ Ready to deploy!

---

## 📱 Your Deployed URLs

After deployment, you'll have:
- **Backend API**: `https://lstbooks-backend.onrender.com/api`
- **Health Check**: `https://lstbooks-backend.onrender.com/api/health`
- **Subjects**: `https://lstbooks-backend.onrender.com/api/subjects`
- **Quizzes**: `https://lstbooks-backend.onrender.com/api/quizzes`

---

## 🐛 Common Issues

**MongoDB Connection Failed?**
- MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`

**App Not Responding?**
- Check Render logs
- Verify environment variables

**Module Not Found?**
- Check `package.json` dependencies
- Rebuild on Render

---

See **RENDER_DEPLOYMENT_GUIDE.md** for detailed instructions.

