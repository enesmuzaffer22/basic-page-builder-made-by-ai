import React, { useState, useEffect } from "react";
import type { ElementType } from "../types";
import { usePageBuilderStore } from "../store/pageBuilderStore";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getElementLabel = (type: ElementType): string => {
  return type;
};

const LayersPanel: React.FC = () => {
  // Use individual selectors for better performance
  const elements = usePageBuilderStore((state) => state.elements);
  const selectedElementId = usePageBuilderStore(
    (state) => state.selectedElementId
  );
  const rootElementId = usePageBuilderStore((state) => state.rootElementId);
  const selectElement = usePageBuilderStore((state) => state.selectElement);
  const deleteElement = usePageBuilderStore((state) => state.deleteElement);
  const groupElements = usePageBuilderStore((state) => state.groupElements);

  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  // Debug info
  useEffect(() => {
    console.log("Current elements in LayersPanel:", elements);
    console.log("Root element ID:", rootElementId);
    console.log("Selected element ID:", selectedElementId);
  }, [elements, rootElementId, selectedElementId]);

  const rootElement = elements.find((el) => el.id === rootElementId);
  if (!rootElement) {
    console.error("Root element not found");
    return <div>Error: Root element not found</div>;
  }

  const handleElementSelect = (id: string, multiSelect: boolean) => {
    console.log(`Selecting element: ${id}, multiSelect: ${multiSelect}`);
    selectElement(id);

    if (multiSelect) {
      setSelectedElements((prev) => {
        if (prev.includes(id)) {
          return prev.filter((elementId) => elementId !== id);
        }
        return [...prev, id];
      });
    } else {
      setSelectedElements([id]);
    }
  };

  const handleGroupElements = () => {
    if (selectedElements.length >= 2) {
      console.log(`Grouping elements: ${selectedElements.join(", ")}`);
      groupElements(selectedElements);
      setSelectedElements([]);
    }
  };

  const renderElementTree = (elementId: string, depth = 0) => {
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      console.warn(
        `Element with id ${elementId} not found in renderElementTree`
      );
      return null;
    }

    const isSelected = selectedElementId === element.id;
    const isMultiSelected = selectedElements.includes(element.id);
    const isGroup = element.isGroup;
    const icon = getElementIcon(element.type);

    // Special display for root element
    const displayName =
      element.id === rootElementId
        ? element.content || "Page Container"
        : isGroup && element.groupName
        ? element.groupName
        : element.content &&
          !["p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(element.type)
        ? element.content
        : "";

    // For text elements, show content preview
    const contentPreview =
      ["p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(element.type) &&
      element.content
        ? `: ${element.content}`
        : "";

    return (
      <div
        key={element.id}
        style={{
          marginLeft: `${depth * 20}px`,
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            padding: "8px",
            backgroundColor: isSelected ? "#e6f7ff" : "transparent",
            border: isMultiSelected
              ? "1px dashed #1890ff"
              : "1px solid transparent",
            marginBottom: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          onClick={(e) =>
            handleElementSelect(element.id, e.ctrlKey || e.metaKey)
          }
        >
          <div
            style={{
              fontWeight: isSelected ? "bold" : "normal",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                padding: "2px 6px",
                backgroundColor: "#eee",
                borderRadius: "3px",
                fontSize: "12px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="element-icon">{icon}</span>
            </span>
            {displayName && (
              <span style={{ fontSize: "13px" }}>{displayName}</span>
            )}
            <span
              style={{ fontSize: "13px", color: "#666", fontStyle: "italic" }}
            >
              {contentPreview}
            </span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {element.id !== rootElementId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Deleting element: ${element.id}`);
                  deleteElement(element.id);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff4d4f",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {element.children.length > 0 && (
          <div
            style={{
              marginLeft: "10px",
              borderLeft: "2px solid #e8e8e8",
              paddingLeft: "8px",
            }}
          >
            {element.children.map((childId) =>
              renderElementTree(childId, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "300px",
        height: "100%",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        background: "#f5f5f5",
        overflowY: "auto",
      }}
    >
      <h2>Layers</h2>

      {selectedElements.length >= 2 && (
        <button
          onClick={handleGroupElements}
          style={{
            padding: "8px",
            background: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          Group Selected Elements
        </button>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        <h3>Structure</h3>
        {renderElementTree(rootElementId)}
      </div>
    </div>
  );
};

export default LayersPanel;
