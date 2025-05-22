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
        borderTop: "1px solid rgba(88, 166, 255, 0.2)",
        background: "#091433",
        maxHeight: "40vh",
        overflowY: "auto",
      }}
      className="export-panel"
    >
      <div style={{ marginBottom: "15px" }}>
        <h3
          style={{
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "18px",
            color: "#58a6ff",
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
            maxHeight: "300px",
            overflowY: "auto",
          }}
          className="elements-container"
        >
          {AVAILABLE_ELEMENTS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleAddElement(type)}
              style={{
                padding: "8px 10px",
                background: "rgba(9, 20, 51, 0.7)",
                border: "1px solid rgba(88, 166, 255, 0.2)",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "2px",
                color: "#f2f2f2",
                fontSize: "13px",
                minWidth: "120px",
                textAlign: "center",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                height: "36px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(88, 166, 255, 0.2)";
                e.currentTarget.style.borderColor = "#58a6ff";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.backgroundColor =
                  "rgba(88, 166, 255, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "rgba(88, 166, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.backgroundColor = "rgba(9, 20, 51, 0.7)";
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
                  color: "#58a6ff",
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
          className="primary-button"
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow =
              "0 4px 10px rgba(88, 166, 255, 0.3)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          View Generated Code
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
