A full-stack note-taking/blogging web application built with React, Express, and MongoDB. Users can sign up, log in, and create, read, update, and delete notes with pagination and secure access control.

## 🔧 Technologies Used

### Frontend
- React
- TypeScript
- React Context + Reducer for state management
- Axios
- Vite

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- bcrypt (for password hashing)
- JSON Web Tokens (JWT)

## 🔐 Features

- 🔑 Authentication: User signup, login, logout with hashed passwords and JWT.
- 📝 Notes:
  - Pagination for efficient loading
  - Create, edit, delete notes
  - Only the creator of a note can edit/delete it
- 🔒 Token Validation: All protected routes require a valid JWT.
- ⚠️ Authorization: Users cannot modify others' notes.
- 💾 MongoDB: Stores users and notes data.

## 🧪 Testing

- Playwright end-to-end tests
- Session handling and CRUD flows are verified

## 📦 Folder Structure

blog-app/
├── backend/
│   ├── controllers/
│   ├── middleware/           # authMiddleware.ts
│   ├── models/               # userModel.ts, noteModel.ts
│   ├── routes/               # auth.routes.ts, notes.routes.ts
│   └── services/
├── frontend/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── README.md

## 📲 API Overview

### Auth Routes
| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| POST   | /api/auth/signup   | Register new user     |
| POST   | /api/auth/login    | Log in and get token  |

### Notes Routes (Protected)
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | /api/notes         | Get paginated notes       |
| POST   | /api/notes         | Create a note             |
| GET    | /api/notes/:id     | Get a specific note       |
| PUT    | /api/notes/:id     | Update a note             |
| DELETE | /api/notes/:id     | Delete a note (owner only) |

All protected routes require Authorization header: Bearer <token>

## 🚀 Getting Started

### 1. Clone the Repo

git clone https://github.com/LihiPorg/blog-app.git  
cd blog-app

### 2. Set Up Environment Variables

Create `.env` file:

MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret

### 3. Install & Run Backend

cd backend  
npm install  
npm run dev

### 4. Install & Run Frontend

cd frontend  
npm install  
npm run dev

### 5. Run Playwright Tests (optional)

npx playwright test

## ✅ TODO

- User profile UI
- Note search
- Better styling
- Refresh tokens

## 👤 Author

Lihi Porgador

