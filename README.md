# TaskSphere – Personal Task Management Web App  

TaskSphere is a simple full-stack web application where users can **register, log in, and manage their personal tasks**.  
It is built using **Node.js, Express.js, MongoDB (Mongoose)** for the backend and **HTML, CSS, and JavaScript** for the frontend.  

---

## 🚀 Features
- User **registration** and **login** (with JWT authentication)  
- **Password hashing** with bcrypt for security  
- **CRUD operations** for tasks: Add, View, Update, Delete  
- **Mark tasks as completed**  
- **Per-user tasks only** (each user sees their own list)  
- Task **stats** (Pending vs Completed count)  
- Search tasks by title  
- Responsive UI with a clean dark theme  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas or local) with Mongoose  
- **Authentication:** JWT (JSON Web Token)  
- **Frontend:** HTML5, CSS3, Vanilla JavaScript  
- **Dev tools:** Nodemon, dotenv  

---

## 📂 Project Structure

```

tasksphere/
├── backend/
│ ├── server.js
│ ├── routes/
│ │ ├── auth.js
│ │ └── tasks.js
│ ├── models/
│ │ ├── User.js
│ │ └── Task.js
│ └── middleware/
│ └── authMiddleware.js
├── public/
│ ├── css/
│ │ └── styles.css
│ └── js/
│ ├── login.js
│ ├── register.js
│ └── dashboard.js
├── views/
│ ├── login.html
│ ├── register.html
│ └── dashboard.html
├── .env.example
└── README.md

```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tasksphere.git
cd tasksphere/backend

2. Install dependencies

npm install

3. Configure environment variables
Create a .env file in the backend folder (copy from .env.example) and set values:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key
PORT=3000

4. Run the server

npm start     # for production

The backend will run at:
👉 http://localhost:3000



🖥️ Usage

Go to /register → Create a new account.
Go to /login → Log in with your credentials.
Access /dashboard → Add, view, edit, complete, or delete tasks.
Tasks are saved per-user in MongoDB.

📬 API Endpoints
Auth
POST /api/auth/register → Register a new user
POST /api/auth/login → Log in and receive JWT token
GET /api/auth/me → Get current logged-in user (requires token)
Tasks (protected)
GET /api/tasks → Get all tasks (with search, pagination, sorting)
GET /api/tasks/stats → Get task counts (Pending, Completed)
POST /api/tasks → Create a new task
GET /api/tasks/:id → Get a single task
PUT /api/tasks/:id → Update a task
PATCH /api/tasks/:id/complete → Mark a task as completed
DELETE /api/tasks/:id → Delete a task




