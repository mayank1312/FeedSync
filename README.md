# 🗣️ FeedSync

A modern, elegant, and efficient **User Feedback System** built with **React**, **Express**, **Prisma**, and **PostgreSQL**. This platform allows users to submit feedback (suggestions, bug reports, feature requests) and visualize it in a sleek dashboard with filtering, sorting, and search capabilities.

---

## ✨ Features

- 📝 Submit feedback via a modern, responsive form
- 📊 Real-time dashboard with category stats
- 🔍 Filter and search feedback entries
- 📂 Sort by date or name (A-Z, Z-A)
- 🗑️ Delete feedback with instant UI updates
- 💾 Tab memory using `localStorage`
- ⚡ Beautiful UI powered by Tailwind CSS 

---

## 🧑‍💻 Tech Stack

| Frontend        | Backend         | Database        | Others                    |
|-----------------|------------------|------------------|----------------------------|
| React + Vite    | Node.js + Express | PostgreSQL      | Prisma ORM, Shadcn UI      |
| TypeScript      | REST API          | Prisma Client     | Tailwind, Lucide, Toast    |
| Toast Hook      | dotenv + CORS     |                  | Custom Form Validation     |

---

## 📁 Folder Structure

├── public/
├── src/
│ ├── components/ # FeedbackForm, Dashboard, Header, Card
│ ├── hooks/ # use-toast hook
│ ├── pages/ # index.tsx (Main UI)
│ └── styles/ # Tailwind CSS styles
├── package.json
├── vite.config.ts
├── README.md

feedback-backend/
├── prisma/
│ └── schema.prisma # Prisma schema
├── server.js # Express backend
├── .env # DATABASE_URL
└── package.json  


---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mayank1312/FeedSync.git

npm install --force
npm run dev
```
 Frontend runs at: http://localhost:8080


3️⃣ Run the Backend
```bash
cd feedback-backend
npm install
node server.js
```
Backend runs at: http://localhost:4000

👨‍💻 Author
Mayank Dhingra
B.Tech CSE-DS | Full Stack Developer

