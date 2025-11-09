
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = () => {
    const newRoom = uuidv4();
    navigate(`/room/${newRoom}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim()) return alert("Please enter a valid Room ID");
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Welcome, <span className="text-blue-400">{user?.username}</span> 👋
        </h1>

        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4 transition-all"
        >
          ➕ Create New Room
        </button>

        <form onSubmit={handleJoinRoom} className="space-y-3">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-all"
          >
            🔗 Join Room
          </button>
        </form>

        <button
          onClick={logout}
          className="mt-6 w-full text-sm text-red-400 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
