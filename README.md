# ✅ TaskFlow — Full Stack MERN Todo Application

> A modern, production-ready Todo Web Application built with the MERN stack (MongoDB, Express.js, React, Node.js). Designed as a beginner-friendly internship project with clean code, JWT authentication, role-based access, and a beautiful Glassmorphism UI.

---

## 📸 Project Overview

TaskFlow is a full-featured task management application where users can:
- Register and login securely
- Create, edit, delete, and manage tasks
- Filter, search, and sort their todos
- Manage their profile and upload a profile picture
- Admin users can manage all users and view platform statistics

---

## ✨ Features

### 🔐 Authentication
- Secure Register & Login with JWT
- Passwords hashed using bcrypt
- JWT stored in HTTP-only cookies (secure, not accessible by JavaScript)
- Protected routes — only logged-in users can access the dashboard

### 📋 Todo Management (Full CRUD)
- Create tasks with Title, Description, Due Date, Priority, Category, Tags, and Notes
- Edit and Delete tasks
- Mark tasks as Complete or Pending
- View all tasks in a clean dashboard

### 🔍 Search, Filter & Sort
- Search by Title, Category, or Tags
- Filter by Status (Completed / Pending), Priority, Category
- Sort by Newest, Oldest, Due Date, Priority, Alphabetical

### 👤 Profile Management
- Update Name and Email
- Upload Profile Picture
- Change Password
- Delete Account

### 🛡️ Admin Panel
- View all registered users
- Delete users
- View platform statistics (Total Users, Tasks, Completed, Pending)
- Role-based access (only admin role can access)

### 🎨 UI/UX
- Beautiful Glassmorphism design
- Dark Mode Toggle
- Fully Responsive (Mobile, Tablet, Desktop)
- Smooth CSS animations and transitions
- Professional Landing Page with Hero, Features, FAQ, Contact sections

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Create React App) | UI Framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests to backend |
| Context API | Global state management (auth, theme) |
| Plain CSS | Styling (no frameworks) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| cookie-parser | Read/write cookies |
| cors | Cross-origin requests |
| express-validator | Input validation |
| dotenv | Environment variables |
| multer | File uploads (profile pictures) |

---

## 📁 Project Folder Structure

```
todo-app/
│
├── frontend/                    # React Application
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/               # Full page components
│       ├── layouts/             # Layout wrappers
│       ├── services/            # Axios API call functions
│       ├── context/             # Context API (Auth, Theme)
│       ├── hooks/               # Custom React hooks
│       ├── assets/              # Images, icons
│       ├── css/                 # All CSS files
│       ├── App.js               # Root component with routes
│       └── index.js             # Entry point
│
├── backend/                     # Express Application
│   ├── config/                  # Database connection
│   ├── controllers/             # Business logic
│   ├── middleware/              # Auth, error, validation middleware
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route definitions
│   ├── validators/              # express-validator rules
│   ├── utils/                   # Helper functions
│   ├── public/uploads/          # Uploaded profile pictures
│   └── server.js                # Entry point
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Run the backend:

```bash
npm run dev
```

Backend will start at: `http://localhost:5000`

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm start
```

Frontend will start at: `http://localhost:3000`

---

## 🌐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and a new **Project**
3. Create a **Cluster** (free tier M0)
4. Click **Connect** → **Connect your application**
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
   ```
6. Replace `username`, `password`, and paste it as `MONGO_URI` in your `.env`
7. In **Network Access**, add `0.0.0.0/0` to allow connections from anywhere

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key to sign JWT tokens | `mysecretkey123` |
| `JWT_EXPIRE` | JWT token expiry time | `7d` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend `.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🚀 Deployment Guide

### Deploy Backend on Render

1. Push your code to GitHub
2. Go to [Render](https://render.com) and create a free account
3. Click **New Web Service** → Connect your GitHub repo
4. Set **Root Directory** to `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `node server.js`
7. Add all environment variables from your `.env` file
8. Click **Deploy**

### Deploy Frontend on Vercel

1. Go to [Vercel](https://vercel.com) and create a free account
2. Click **New Project** → Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `REACT_APP_API_URL` = your Render backend URL
5. Click **Deploy**

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### User Profile
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/user/profile` | Get profile | ✅ |
| PUT | `/api/user/profile` | Update profile | ✅ |
| PUT | `/api/user/change-password` | Change password | ✅ |
| DELETE | `/api/user/delete-account` | Delete account | ✅ |

### Todos
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/todos` | Get all todos | ✅ |
| POST | `/api/todos` | Create todo | ✅ |
| PUT | `/api/todos/:id` | Update todo | ✅ |
| DELETE | `/api/todos/:id` | Delete todo | ✅ |
| PATCH | `/api/todos/:id/complete` | Toggle complete | ✅ |

### Admin
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin stats | ✅ Admin only |
| GET | `/api/admin/users` | All users | ✅ Admin only |
| DELETE | `/api/admin/user/:id` | Delete user | ✅ Admin only |

---

## 🔮 Future Improvements

- [ ] Email verification on registration
- [ ] Forgot password / Reset password via email
- [ ] Task sharing between users
- [ ] Subtasks / checklists inside a task
- [ ] Calendar view for tasks
- [ ] Export tasks to CSV / PDF
- [ ] Push notifications for due dates
- [ ] Mobile app using React Native

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> 💡 **Tip for Interview:** When explaining this project, start with: *"I built a full-stack Todo application using the MERN stack. The frontend is in React with Context API for state management, the backend is in Express with JWT authentication stored in HTTP-only cookies for security, and data is stored in MongoDB Atlas using Mongoose."*
