# Evalio 🧠💻

**Evalio** is a real-time collaborative pair programming and technical interview platform. It enables users to join a shared code editor, collaborate live, and switch between languages for effective interviews, coding sessions, or mentorship.

---

## 🚀 Features

- 🔐 User authentication (Login/Register with JWT)
- 🧑‍💻 Real-time collaborative code editor using Socket.IO
- 🌐 Language selector (JavaScript, Python, C++, Java, HTML, etc.)
- 💡 Monaco Editor with VSCode-like experience
- 🎯 Protected routes using React Router
- 📦 Clean React + Vite + Express + Node architecture

---

## 📸 Preview

![Evalio Screenshot](./assets/screenshot.png) <!-- Replace with a real screenshot later -->

---

## 🛠️ Tech Stack

| Frontend      | Backend     | Realtime      | Auth       | Styling      |
|---------------|-------------|---------------|------------|--------------|
| React + Vite  | Express.js  | Socket.IO     | JWT        | Tailwind CSS |

---

## 📁 Project Structure

```
evalio/
├── client/               # Frontend React app
│   ├── components/       # Login, Editor, etc.
│   ├── pages/            # Room page
│   └── App.jsx
├── server/               # Backend Node/Express app
│   ├── routes/           # Auth routes
│   ├── utils/            # JWT verification
│   └── index.js          # Main server with Socket.IO
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/tejaburugu/evalio.git
cd evalio
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
touch .env
```

Create a `.env` file with:

```
JWT_SECRET=your_jwt_secret_here
```

Start backend:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

---

## 🔐 Default Credentials (for demo)

```
Username: teja
Password: 0508
```

---

## 🙌 Acknowledgements

- Monaco Editor by Microsoft
- Socket.IO for WebSocket support
- Vite for lightning-fast frontend builds

---

## 📄 License

MIT License – feel free to fork, contribute, and build on Evalio!
