
import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

export default function Editor({ code, onChange, language }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: code || "// Welcome to RemotePair 👋\n// Start coding here...",
      language: language || "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    });

    editorRef.current = editor;

    // Detect typing
    const sub = editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
    });

    // 👇 Force a layout pass after DOM ready
    setTimeout(() => {
      editor.layout();
    }, 300);

    return () => {
      sub.dispose();
      editor.dispose();
    };
  }, []);

  // Update remote code
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  // Update language dynamically
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setModelLanguage(
        editorRef.current.getModel(),
        language || "javascript"
      );
    }
  }, [language]);

  return (
    <div
      ref={containerRef}
      className="editor-container w-full h-full bg-[#1e1e1e]"
      style={{ position: "relative" }}
    />
  );
}
