
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Helps avoid duplicate key race conditions in development
userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;

