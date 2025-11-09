
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx"; // 👈 import the context provider
import { Buffer } from "buffer";
import process from "process";

window.Buffer = Buffer;
window.process = process;
window.global = window; // 👈 ensures global is defined

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
