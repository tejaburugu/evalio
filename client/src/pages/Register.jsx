
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await register(username, password);
      navigate("/home");
    } catch (err) {
      // Axios error handling
      const msg = err?.response?.data?.message || err?.message || "Server error";
      setErrMsg(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6">Create your account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errMsg && <div className="text-red-400 text-sm">{errMsg}</div>}

        <button className="bg-green-600 hover:bg-green-700 py-2 rounded">Register</button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
