# ⚡ Quick Deploy Commands

## 🔐 Step 1: Authenticate & Push to GitHub

### Option A: GitHub CLI (Easiest)
```bash
# Install (if needed)
brew install gh

# Authenticate
gh auth login

# Push
cd /Volumes/SallnyHD/lstBooks/backend
git push -u origin main
```

### Option B: Personal Access Token
```bash
# Get token from: https://github.com/settings/tokens
# Then push:
git push https://YOUR_TOKEN@github.com/raiddubai1/lstbooks-backend.git main
```

---

## 🚀 Step 2: Deploy on Render

1. Go to https://render.com
2. New + → Web Service
3. Connect: `lstbooks-backend`
4. Settings:
   - Build: `npm install`
   - Start: `npm start`
5. Environment Variables:
   ```
   MONGO_URI=mongodb+srv://raiddubai1_db_user:Dubai_2020&2020@lstbooks.ftmnalb.mongodb.net/?appName=lstbooks
   JWT_SECRET=<run: openssl rand -base64 32>
   NODE_ENV=production
   PORT=10000
   ```
6. Create Web Service

---

## ✅ Step 3: Test

```bash
curl https://lstbooks-backend.onrender.com/api/health
```

---

## 🔄 Future Updates

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render auto-deploys! ✨

---

## 📋 Current Status

✅ Repository configured
✅ Remote added: `https://github.com/raiddubai1/lstbooks-backend.git`
✅ Branch: `main`
✅ `.env` ignored
✅ Ready to push

**Next:** Authenticate and push (see Step 1 above)

---

See **GITHUB_PUSH_AND_RENDER_DEPLOY.md** for detailed instructions.

