import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: "" },
  language: { type: String, default: "javascript" },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", roomSchema);
