# 🧪 Testing Guide for lstBooks Backend

## Quick Test Commands

### 1. Health Check ✅
```bash
curl https://lstbooks-backend.onrender.com/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"lstBooks API is running"}
```

---

### 2. Books Route (NEW!) ✅
```bash
curl https://lstbooks-backend.onrender.com/api/books
```

**Expected Response:**
```json
[
  {
    "_id": "sample1",
    "title": "Dental Anatomy and Physiology",
    "author": "Dr. John Smith",
    "isbn": "978-0-123456-78-9",
    "publisher": "Medical Publishers Inc.",
    "publishedYear": 2023,
    "edition": "5th Edition",
    "category": "Dental Anatomy",
    "description": "Comprehensive guide to dental anatomy and physiology for dental students.",
    "pages": 450,
    "language": "English",
    "available": true,
    "tags": ["anatomy", "physiology", "dental"]
  },
  {
    "_id": "sample2",
    "title": "Clinical Periodontology",
    "author": "Dr. Sarah Johnson",
    ...
  },
  {
    "_id": "sample3",
    "title": "Endodontics: Principles and Practice",
    "author": "Dr. Michael Brown",
    ...
  }
]
```

---

### 3. Test All Routes

```bash
# Health
curl https://lstbooks-backend.onrender.com/api/health

# Books
curl https://lstbooks-backend.onrender.com/api/books

# Subjects
curl https://lstbooks-backend.onrender.com/api/subjects

# Quizzes
curl https://lstbooks-backend.onrender.com/api/quizzes

# Flashcards
curl https://lstbooks-backend.onrender.com/api/flashcards

# OSCE
curl https://lstbooks-backend.onrender.com/api/osce

# Labs
curl https://lstbooks-backend.onrender.com/api/labs

# Skills
curl https://lstbooks-backend.onrender.com/api/skills

# Users
curl https://lstbooks-backend.onrender.com/api/users

# Progress
curl https://lstbooks-backend.onrender.com/api/progress

# Search
curl https://lstbooks-backend.onrender.com/api/search?q=dental

# Dashboard
curl https://lstbooks-backend.onrender.com/api/dashboard/quiz/overview
```

---

## Browser Testing

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://lstbooks-backend.onrender.com/api/health
   ```

2. **Books:**
   ```
   https://lstbooks-backend.onrender.com/api/books
   ```

3. **Subjects:**
   ```
   https://lstbooks-backend.onrender.com/api/subjects
   ```

---

## Test with Postman

### Import Collection

Create a new Postman collection with these requests:

1. **GET Health Check**
   - URL: `https://lstbooks-backend.onrender.com/api/health`
   - Method: GET

2. **GET All Books**
   - URL: `https://lstbooks-backend.onrender.com/api/books`
   - Method: GET

3. **GET Books by Category**
   - URL: `https://lstbooks-backend.onrender.com/api/books?category=Periodontology`
   - Method: GET

4. **Search Books**
   - URL: `https://lstbooks-backend.onrender.com/api/books?search=anatomy`
   - Method: GET

5. **Create Book**
   - URL: `https://lstbooks-backend.onrender.com/api/books`
   - Method: POST
   - Body (JSON):
   ```json
   {
     "title": "Test Book",
     "author": "Test Author",
     "category": "General",
     "description": "Test description",
     "available": true
   }
   ```

---

## Seed Database (Optional)

To populate the database with real book data:

```bash
# SSH into Render or run locally
cd /Volumes/SallnyHD/lstBooks/backend
node scripts/seedBooks.js
```

This will add 10 dental textbooks to your database.

---

## Expected Behavior

### ✅ When Database is Empty
- `/api/books` returns **3 sample books** (hardcoded)
- Status: `200 OK`
- Response: JSON array with sample data

### ✅ When Database Has Data
- `/api/books` returns **real books from MongoDB**
- Status: `200 OK`
- Response: JSON array with database records

### ✅ Health Check
- Always returns `{ "status": "ok" }`
- Status: `200 OK`

### ❌ Invalid Route
- Returns `{ "error": "Route not found" }`
- Status: `404 Not Found`

---

## Troubleshooting

### Issue: "Route not found" for /api/books

**Solution:**
1. Check Render deployment logs
2. Verify the latest code is deployed
3. Trigger manual deploy in Render dashboard

### Issue: Empty array [] returned

**Possible Causes:**
1. Database is empty (should return sample data)
2. Check if the route logic is correct
3. Verify MongoDB connection

### Issue: 500 Internal Server Error

**Solution:**
1. Check Render logs for error details
2. Verify MongoDB connection string
3. Check environment variables

---

## Success Criteria

✅ `/api/health` returns `200 OK` with `{ "status": "ok" }`  
✅ `/api/books` returns `200 OK` with JSON array (sample or real data)  
✅ All other routes return `200 OK` with appropriate data  
✅ Invalid routes return `404 Not Found`  
✅ MongoDB connection successful  

---

**All tests should pass! 🎉**

