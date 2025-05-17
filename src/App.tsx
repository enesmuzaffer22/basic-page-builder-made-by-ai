import "./App.css";
import LayersPanel from "./components/LayersPanel";
import PreviewScreen from "./components/PreviewScreen";
import StyleEditor from "./components/StyleEditor";
import ExportPanel from "./components/ExportPanel";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Basic Page Builder</h1>
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
