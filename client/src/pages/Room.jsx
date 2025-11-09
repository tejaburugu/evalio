
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import Editor from "../components/Editor";

export default function Room() {
  const { id: roomId } = useParams();
  const { user } = useAuth();
  const socketRef = useRef(null);

  const [code, setCode] = useState("// Welcome to RemotePair 👋\n// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [participants, setParticipants] = useState([]);

  // 🔗 Connect to Socket.IO and handle real-time code sync
  useEffect(() => {
    if (!user) return;

    socketRef.current = io("http://localhost:5000");
    const socket = socketRef.current;

    socket.emit("join-room", { roomId, username: user.username });

    socket.on("load-code", (existingCode) => {
      if (existingCode) setCode(existingCode);
    });

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    socket.on("user-joined", (username) => {
      setParticipants((prev) =>
        prev.includes(username) ? prev : [...prev, username]
      );
    });

    return () => socket.disconnect();
  }, [roomId, user]);

  // ✏️ Send code updates
  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socketRef.current?.emit("code-change", { roomId, code: newValue });
  };

  // ⚡ Run code (JS locally, Python on backend)
  const handleRun = async () => {
    try {
      let result = "";
      if (language === "javascript") {
        result = eval(code);
        setOutput(String(result));
      } else {
        const res = await fetch("http://localhost:5000/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });
        const data = await res.json();
        setOutput(data.output || data.error || "No output");
      }

      // Save run results
      await fetch("http://localhost:5000/api/save-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          username: user.username,
          language,
          code,
          output: result || output,
        }),
      });
    } catch (err) {
      setOutput("❌ Error: " + err.message);
    }
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center text-lg text-white bg-gray-900">
        Please log in to access this room.
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 shadow-md">
        <div>
          <h2 className="text-xl font-semibold">
            Room: <span className="text-blue-400">{roomId}</span>
          </h2>
          <p className="text-sm text-gray-300">
            Logged in as <strong>{user.username}</strong>
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="C++">C++</option>
            <option value="java">Java</option>
            <option value="kotlin">Kotlin</option>
            <option value="C#">C#</option>
            <option value="C">C</option>
          </select>

          <button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
          >
            ▶ Run
          </button>

          <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
            {participants.length + 1} online
          </span>
        </div>
      </header>

      {/* Editor + Console */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Editor */}
        <div className="flex-1 border-b border-gray-700">
          <Editor code={code} onChange={handleCodeChange} language={language} />
        </div>

        {/* Console output */}
        <div className="h-[25vh] bg-black text-green-400 p-3 overflow-y-auto font-mono border-t border-gray-700">
          <strong>Output:</strong>
          <pre className="whitespace-pre-wrap mt-2">{output}</pre>
        </div>
      </main>
    </div>
  );
}

