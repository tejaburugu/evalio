import mongoose from "mongoose";

const runSchema = new mongoose.Schema({
  roomId: String,
  username: String,
  language: String,
  code: String,
  output: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Run", runSchema);
