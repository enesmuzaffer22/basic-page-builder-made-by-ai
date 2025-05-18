import "./App.css";
import LayersPanel from "./components/LayersPanel";
import PreviewScreen from "./components/PreviewScreen";
import StyleEditor from "./components/StyleEditor";
import ExportPanel from "./components/ExportPanel";
import { useEffect } from "react";
import { usePageBuilderStore } from "./store/pageBuilderStore";

function App() {
  const undo = usePageBuilderStore((state) => state.undo);
  const redo = usePageBuilderStore((state) => state.redo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "z"
      ) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="app-container">
      <header
        className="app-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0 }}>Basic Page Builder</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            aria-label="Undo"
            className="undo-btn"
            onClick={undo}
            style={{
              background: "white",
              color: "#1890ff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>
              ↻
            </span>
          </button>
          <button
            aria-label="Redo"
            className="redo-btn"
            onClick={redo}
            style={{
              background: "white",
              color: "#1890ff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            ↻
          </button>
        </div>
      </header>

      <main className="app-main">
        <LayersPanel />
        <div className="app-right-panel">
          <PreviewScreen />
          <ExportPanel />
        </div>
        <StyleEditor />
      </main>
    </div>
  );
}

export default App;
