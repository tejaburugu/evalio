const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

// 💡 Initialize app before using it
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// 🧠 Middlewares
app.use(cors());
app.use(express.json());

// 🛣️ Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 🧠 Socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("RemotePair API running");
});

// 🚀 Start server
server.listen(5000, () => {
  console.log("Backend server listening on port 5000");
});
