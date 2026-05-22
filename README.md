# 💸 ExpenseTracker

A full-stack personal finance management web application built with the **MERN stack** — track your income, expenses, and savings with a clean, modern dashboard.

**Developers:** Aviraj & Basudev

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with automatic session expiry detection
- 📊 **Dashboard Overview** — Monthly income, expenses, savings, and savings rate at a glance
- 📅 **Month Selector** — Browse and filter data across any of the last 12 months
- 💰 **Income Management** — Add, view, and delete income entries with categories
- 🧾 **Expense Management** — Full expense tracking with categories and date filters
- 📥 **Export to Excel** — Download your records as `.xlsx` files
- 👤 **Profile Management** — Update name, email, and profile details
- 🔑 **Change Password** — Secure password update flow
- 🌙 **Dark / Light Mode** — Persistent theme toggle across the app
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing with lazy loading |
| DaisyUI + Tailwind CSS v4 | Component library & styling |
| Recharts | Data visualization charts |
| Framer Motion | Animations |
| Lucide React + React Icons | Icon libraries |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| xlsx | Excel file generation |
| dotenv | Environment configuration |
| nodemon | Development auto-reload |

---

## 📁 Project Structure

```
Expencetracker/
├── backend/
│   ├── config/          # Database connection
│   ├── controller/      # Route handlers (user, income, expense, dashboard)
│   ├── middleware/       # JWT auth middleware
│   ├── models/          # Mongoose schemas (User, Income, Expense)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Utility helpers
│   └── server.js        # App entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Sidebar, ToastProvider
│       ├── pages/       # Auth, Dashboard, Income, Expense, Profile, ChangePassword
│       └── utils/
│           ├── api.js         # Axios instance with JWT interceptors
│           └── jwtHelper.js   # Client-side JWT expiry decoder
│
└── package.json         # Root scripts (start, build, dev)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/Aviraj010/Expencetracker.git
cd Expencetracker
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/expensetracker
JWT_SECRET=your_super_secret_key_here
```

### 3. Install Dependencies & Build

Run this single command from the root to install all dependencies and build the frontend:

```bash
npm run build
```

### 4. Start the Application

```bash
npm start
```

The app will be available at **`http://localhost:4000`**

---

## 💻 Development Mode

To run the frontend and backend separately with hot-reloading:

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

Frontend dev server runs at `http://localhost:5173` and proxies API calls to `http://localhost:4000`.

---

## 🔌 API Endpoints

### Auth — `/api/user`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create a new account |
| `POST` | `/login` | Login and receive JWT token |

### Income — `/api/income` *(Protected)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all income records |
| `POST` | `/add` | Add a new income entry |
| `DELETE` | `/:id` | Delete an income record |
| `GET` | `/download` | Export income to Excel |

### Expense — `/api/expense` *(Protected)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all expense records |
| `POST` | `/add` | Add a new expense entry |
| `DELETE` | `/:id` | Delete an expense record |
| `GET` | `/download` | Export expenses to Excel |

### Dashboard — `/api/dashboard` *(Protected)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/overview?month=&year=` | Get monthly financial summary |

---

## 🔐 Security

- Passwords are hashed using **bcryptjs** before storage — plain-text passwords are never saved.
- All protected routes require a valid **JWT Bearer token** in the `Authorization` header.
- The frontend automatically **detects expired JWTs** client-side by decoding the token's `exp` claim, clearing the stale session before making any API call.
- A **response interceptor** handles `401 Unauthorized` responses from the server, ensuring expired or revoked server-side sessions also trigger a clean logout and redirect.

---

## 📦 Production Build

```bash
# From the project root
npm run build   # Installs deps and builds the React frontend
npm start       # Serves the built frontend + API from Express on port 4000
```

The backend serves the production React build as static files, so only **one port** is needed in production.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🐛 Issues

Found a bug? [Open an issue](https://github.com/Aviraj010/Expencetracker/issues) on GitHub.
