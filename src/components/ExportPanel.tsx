import React from "react";
import { usePageBuilderStore } from "../store/pageBuilderStore";

const ExportPanel: React.FC = () => {
  const generateHTML = usePageBuilderStore((state) => state.generateHTML);
  const generateCSS = usePageBuilderStore((state) => state.generateCSS);

  const handleViewInNewTab = () => {
    const html = generateHTML();
    const css = generateCSS();

    const completeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Builder Export</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
</body>
</html>
    `.trim();

    const blob = new Blob([completeHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Clean up the URL object after the new tab is opened
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid #ddd",
        background: "#f8f8f8",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={handleViewInNewTab}
        style={{
          padding: "12px 24px",
          background: "#1890ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        View Generated Code
      </button>
    </div>
  );
};

export default ExportPanel;
