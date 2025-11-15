# 📚 lstBooks Backend API Routes Reference

## ✅ All Available Routes

Your lstBooks backend now has **12 route groups** with full CRUD operations:

---

## 🏥 Health Check

### `GET /api/health`
**Description**: Check if the API is running  
**Response**: `200 OK`
```json
{
  "status": "ok",
  "message": "lstBooks API is running"
}
```

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/health
```

---

## 📖 Books (NEW!)

### `GET /api/books`
**Description**: Get all books (returns sample data if database is empty)  
**Query Parameters**:
- `category` - Filter by category (e.g., "Dental Anatomy", "Periodontology")
- `available` - Filter by availability (true/false)
- `search` - Search in title, author, or description

**Response**: `200 OK`
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
    "description": "Comprehensive guide to dental anatomy...",
    "pages": 450,
    "language": "English",
    "available": true,
    "tags": ["anatomy", "physiology", "dental"]
  }
]
```

**Test:**
```bash
# Get all books
curl https://lstbooks-backend.onrender.com/api/books

# Filter by category
curl https://lstbooks-backend.onrender.com/api/books?category=Periodontology

# Search books
curl https://lstbooks-backend.onrender.com/api/books?search=anatomy
```

### `GET /api/books/:id`
**Description**: Get a single book by ID  
**Response**: `200 OK` or `404 Not Found`

### `POST /api/books`
**Description**: Create a new book  
**Required Fields**: `title`, `author`  
**Response**: `201 Created`

### `PUT /api/books/:id`
**Description**: Update a book  
**Response**: `200 OK` or `404 Not Found`

### `DELETE /api/books/:id`
**Description**: Delete a book  
**Response**: `200 OK` or `404 Not Found`

---

## 📚 Subjects

### `GET /api/subjects`
**Description**: Get all subjects  
**Response**: `200 OK`

### `GET /api/subjects/:id`
**Description**: Get a single subject  
**Response**: `200 OK` or `404 Not Found`

### `POST /api/subjects`
**Description**: Create a new subject  
**Required Fields**: `name`, `description`  
**Response**: `201 Created`

### `PUT /api/subjects/:id`
**Description**: Update a subject  
**Response**: `200 OK`

### `DELETE /api/subjects/:id`
**Description**: Delete a subject  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/subjects
```

---

## 📝 Quizzes

### `GET /api/quizzes`
**Description**: Get all quizzes  
**Query Parameters**: `subjectId`, `forAttempt`  
**Response**: `200 OK`

### `GET /api/quizzes/:id`
**Description**: Get a single quiz  
**Response**: `200 OK`

### `POST /api/quizzes`
**Description**: Create a new quiz  
**Response**: `201 Created`

### `POST /api/quizzes/:id/start`
**Description**: Start a quiz attempt  
**Response**: `201 Created`

### `POST /api/quizzes/:id/submit`
**Description**: Submit quiz answers  
**Response**: `200 OK`

### `GET /api/quizzes/:id/attempts/:attemptId`
**Description**: Get quiz attempt results  
**Response**: `200 OK`

### `GET /api/quizzes/:id/results`
**Description**: Get all attempts for a quiz  
**Response**: `200 OK`

### `GET /api/quizzes/:id/stats`
**Description**: Get quiz statistics  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/quizzes
```

---

## 🗂️ Flashcards

### `GET /api/flashcards`
**Description**: Get all flashcards  
**Query Parameters**: `subjectId`  
**Response**: `200 OK`

### `GET /api/flashcards/:id`
**Description**: Get a single flashcard  
**Response**: `200 OK`

### `POST /api/flashcards`
**Description**: Create a new flashcard  
**Required Fields**: `question`, `answer`, `subjectId`  
**Response**: `201 Created`

### `PUT /api/flashcards/:id`
**Description**: Update a flashcard  
**Response**: `200 OK`

### `DELETE /api/flashcards/:id`
**Description**: Delete a flashcard  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/flashcards
```

---

## 🏥 OSCE Stations

### `GET /api/osce`
**Description**: Get all OSCE stations  
**Response**: `200 OK`

### `GET /api/osce/:id`
**Description**: Get a single OSCE station  
**Response**: `200 OK`

### `POST /api/osce`
**Description**: Create a new OSCE station  
**Response**: `201 Created`

### `PUT /api/osce/:id`
**Description**: Update an OSCE station  
**Response**: `200 OK`

### `DELETE /api/osce/:id`
**Description**: Delete an OSCE station  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/osce
```

---

## 🔬 Labs

### `GET /api/labs`
**Description**: Get all labs  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/labs
```

---

## 🛠️ Clinical Skills

### `GET /api/skills`
**Description**: Get all clinical skills  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/skills
```

---

## 👤 Users

### `GET /api/users`
**Description**: Get all users  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/users
```

---

## 📊 Progress

### `GET /api/progress`
**Description**: Get user progress  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/progress
```

---

## 🔍 Search

### `GET /api/search`
**Description**: Global search across all content  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/search?q=dental
```

---

## 📈 Dashboard

### `GET /api/dashboard/quiz/overview`
**Description**: Get quiz analytics overview  
**Response**: `200 OK`

### `GET /api/dashboard/quiz/:id/trend`
**Description**: Get quiz performance trends  
**Response**: `200 OK`

**Test:**
```bash
curl https://lstbooks-backend.onrender.com/api/dashboard/quiz/overview
```

---

## 📋 Complete Route List

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/health` | GET | Health check |
| `/api/books` | GET, POST | Books management ⭐ NEW |
| `/api/books/:id` | GET, PUT, DELETE | Single book operations ⭐ NEW |
| `/api/subjects` | GET, POST | Subjects management |
| `/api/subjects/:id` | GET, PUT, DELETE | Single subject operations |
| `/api/quizzes` | GET, POST | Quizzes management |
| `/api/quizzes/:id` | GET, PUT, DELETE | Single quiz operations |
| `/api/quizzes/:id/start` | POST | Start quiz attempt |
| `/api/quizzes/:id/submit` | POST | Submit quiz answers |
| `/api/flashcards` | GET, POST | Flashcards management |
| `/api/flashcards/:id` | GET, PUT, DELETE | Single flashcard operations |
| `/api/osce` | GET, POST | OSCE stations management |
| `/api/osce/:id` | GET, PUT, DELETE | Single OSCE operations |
| `/api/labs` | GET, POST | Labs management |
| `/api/skills` | GET, POST | Clinical skills management |
| `/api/users` | GET, POST | User management |
| `/api/progress` | GET | Progress tracking |
| `/api/search` | GET | Global search |
| `/api/dashboard/*` | GET | Analytics & dashboard |

---

## ✅ Verification Checklist

- [x] `/api/health` - Returns `{ "status": "ok" }`
- [x] `/api/books` - Returns sample book data or real data from MongoDB
- [x] All routes return JSON responses
- [x] All routes return proper HTTP status codes
- [x] MongoDB connection working
- [x] Sample data available when database is empty

---

**All routes are now live and ready to use! 🚀**

