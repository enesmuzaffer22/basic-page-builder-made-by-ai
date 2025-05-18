import React from "react";
import { usePageBuilderStore } from "../store/pageBuilderStore";
import type { ElementType } from "../types";
import {
  FaBox,
  FaHeading,
  FaParagraph,
  FaLink,
  FaImage,
  FaList,
  FaListOl,
  FaListUl,
  FaCode,
  FaFont,
  FaRegSquare,
  FaSquareCheck,
} from "react-icons/fa6";

// Function to get icon for element type
const getElementIcon = (type: ElementType) => {
  switch (type) {
    case "div":
      return <FaBox />;
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return <FaHeading />;
    case "p":
      return <FaParagraph />;
    case "a":
      return <FaLink />;
    case "img":
      return <FaImage />;
    case "ul":
      return <FaListUl />;
    case "ol":
      return <FaListOl />;
    case "li":
      return <FaList />;
    case "button":
      return <FaSquareCheck />;
    case "span":
      return <FaFont />;
    case "section":
      return <FaRegSquare />;
    default:
      return <FaCode />;
  }
};

const AVAILABLE_ELEMENTS: { type: ElementType; label: string }[] = [
  { type: "div", label: "Container (div)" },
  { type: "h1", label: "Heading 1" },
  { type: "h2", label: "Heading 2" },
  { type: "h3", label: "Heading 3" },
  { type: "p", label: "Paragraph" },
  { type: "a", label: "Link" },
  { type: "button", label: "Button" },
  { type: "img", label: "Image" },
  { type: "ul", label: "Unordered List" },
  { type: "ol", label: "Ordered List" },
  { type: "span", label: "Span" },
  { type: "section", label: "Section" },
];

const ExportPanel: React.FC = () => {
  const generateHTML = usePageBuilderStore((state) => state.generateHTML);
  const generateCSS = usePageBuilderStore((state) => state.generateCSS);
  const addElement = usePageBuilderStore((state) => state.addElement);
  const selectedElementId = usePageBuilderStore(
    (state) => state.selectedElementId
  );
  const rootElementId = usePageBuilderStore((state) => state.rootElementId);

  const handleAddElement = (type: ElementType) => {
    console.log(
      `Adding element of type: ${type}, to parent: ${
        selectedElementId || rootElementId
      }`
    );
    addElement(type, selectedElementId || rootElementId);
  };

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
    /* Apply box-sizing to all elements for consistent rendering */
    * {
      box-sizing: border-box;
    }
${css}
  </style>
</head>
<body>
  <div class="page-container" style="width: 100%; margin: 0 auto; padding: 0; overflow: hidden;">
    ${html}
  </div>
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
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <h3
          style={{
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "18px",
            color: "#333",
          }}
        >
          Add Element
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {AVAILABLE_ELEMENTS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleAddElement(type)}
              style={{
                padding: "8px 10px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "2px",
                color: "#333",
                fontSize: "13px",
                minWidth: "120px",
                textAlign: "center",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                height: "36px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "#1890ff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#ddd";
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  color: "#1890ff",
                }}
              >
                {getElementIcon(type)}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
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
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#40a9ff";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#1890ff";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
          }}
        >
          View Generated Code
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
