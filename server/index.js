
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Room from "./models/Room.js";
import authRoutes from "./routes/auth.js";
import Run from "./models/Run.js";
import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ------------------------------------------------------------------
   🧠 Collaborative code editing logic
------------------------------------------------------------------ */
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // === Code collaboration ===
  socket.on("join-room", async ({ roomId, username }) => {
    try {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);

      let room = await Room.findOne({ roomId });
      if (!room) {
        room = await Room.create({ roomId, code: "" });
        console.log(`🆕 Created new room: ${roomId}`);
      } else {
        socket.emit("load-code", room.code);
      }

      socket.to(roomId).emit("user-joined", username);
    } catch (err) {
      console.error(`❌ Error in join-room for ${roomId}:`, err.message);
    }
  });

  socket.on("code-change", async ({ roomId, code }) => {
    try {
      socket.to(roomId).emit("code-update", code);
      await Room.findOneAndUpdate(
        { roomId },
        { code, updatedAt: Date.now() },
        { new: true }
      );
    } catch (err) {
      console.error("❌ Error updating code:", err.message);
    }
  });

  /* ------------------------------------------------------------------
     🎥 Video + Audio WebRTC signaling
  ------------------------------------------------------------------ */
  const activeUsers = {};

  socket.on("join-media", ({ roomId }) => {
    if (!activeUsers[roomId]) activeUsers[roomId] = [];
    activeUsers[roomId].push(socket.id);

    const otherUsers = activeUsers[roomId].filter((id) => id !== socket.id);
    socket.emit("all-users", otherUsers);

    socket.on("sending-signal", (payload) => {
      io.to(payload.userToSignal).emit("user-joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on("returning-signal", (payload) => {
      io.to(payload.callerID).emit("receiving-returned-signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
      activeUsers[roomId] = activeUsers[roomId]?.filter((id) => id !== socket.id);
      io.to(roomId).emit("user-left", socket.id);
    });
  });
});

/* ------------------------------------------------------------------
   ⚙️ Code execution + persistence
------------------------------------------------------------------ */
app.post("/api/run", async (req, res) => {
  const { code, language } = req.body;
  try {
    if (language === "python") {
      const fs = await import("fs/promises");
      await fs.writeFile("temp.py", code);
      const { stdout, stderr } = await execPromise("python temp.py");
      return res.json({ output: stdout || stderr });
    } else {
      return res.json({ output: eval(code) });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/api/save-run", async (req, res) => {
  try {
    const { roomId, username, language, code, output } = req.body;
    await Run.create({ roomId, username, language, code, output });
    res.json({ message: "Run saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------------------------
   🚀 Start the server
------------------------------------------------------------------ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// // === WebRTC signaling events ===
// const mediaRooms = {}; // { roomId: [socketIds...] }

// io.on("connection", (socket) => {
//   // Join room for code collaboration
//   socket.on("join-room", async ({ roomId, username }) => {
//     socket.join(roomId);
//     console.log(`${username} joined room ${roomId}`);
//   });

//   // === Video/Audio signaling ===
//   socket.on("join-media", ({ roomId }) => {
//     if (!mediaRooms[roomId]) mediaRooms[roomId] = [];
//     mediaRooms[roomId].push(socket.id);

//     const users = mediaRooms[roomId].filter((id) => id !== socket.id);
//     socket.emit("all-users", users);
//   });

//   socket.on("sending-signal", (payload) => {
//     io.to(payload.userToSignal).emit("user-joined", {
//       signal: payload.signal,
//       callerID: payload.callerID,
//     });
//   });

//   socket.on("returning-signal", (payload) => {
//     io.to(payload.callerID).emit("receiving-returned-signal", {
//       signal: payload.signal,
//       id: socket.id,
//     });
//   });

//   socket.on("disconnect", () => {
//     for (const roomId in mediaRooms) {
//       mediaRooms[roomId] = mediaRooms[roomId].filter((id) => id !== socket.id);
//       socket.to(roomId).emit("user-left", socket.id);
//     }
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });
