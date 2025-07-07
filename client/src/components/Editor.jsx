import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const roomId = "room1";

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "1rem", backgroundColor: "#1e1e1e", color: "white", display: "flex", justifyContent: "space-between" }}>
        <h2>👨‍💻 RemotePair Room</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "0.4rem", borderRadius: "5px" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
        </select>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Editor
          language={language}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          height="100%"
          width="100%"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
