module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New client connected");

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 Client joined room: ${roomId}`);
    });

    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });
};
