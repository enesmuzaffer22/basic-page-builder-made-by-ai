import React, { useState, useEffect } from "react";
import type { ElementType } from "../types";
import { usePageBuilderStore } from "../store/pageBuilderStore";

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
  { type: "li", label: "List Item" },
  { type: "span", label: "Span" },
  { type: "section", label: "Section" },
];

// Helper function to get a readable label for an element type
const getElementLabel = (type: ElementType): string => {
  const element = AVAILABLE_ELEMENTS.find((el) => el.type === type);
  return element ? element.label : type;
};

const LayersPanel: React.FC = () => {
  // Use individual selectors for better performance
  const elements = usePageBuilderStore((state) => state.elements);
  const selectedElementId = usePageBuilderStore(
    (state) => state.selectedElementId
  );
  const rootElementId = usePageBuilderStore((state) => state.rootElementId);
  const addElement = usePageBuilderStore((state) => state.addElement);
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

  const handleAddElement = (type: ElementType) => {
    console.log(
      `Adding element of type: ${type}, to parent: ${
        selectedElementId || rootElementId
      }`
    );
    addElement(type, selectedElementId || rootElementId);
  };

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
    const elementLabel = getElementLabel(element.type);
    const elementContent = element.content ? `: ${element.content}` : "";
    const isGroup = element.isGroup;

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
            backgroundColor: isSelected
              ? "#e6f7ff"
              : isGroup
              ? "#f0f7ff"
              : "transparent",
            border: isMultiSelected
              ? "1px dashed #1890ff"
              : isGroup
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
                backgroundColor: isGroup ? "#1890ff" : "#eee",
                borderRadius: "3px",
                fontSize: "12px",
                color: isGroup ? "white" : "#333",
              }}
            >
              {elementLabel}
            </span>
            {isGroup && (
              <span
                style={{
                  backgroundColor: "#1890ff",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}
              >
                Group
              </span>
            )}
            <span
              style={{ fontSize: "13px", color: "#666", fontStyle: "italic" }}
            >
              {elementContent}
            </span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {isGroup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Select the group to edit it
                  selectElement(element.id);
                }}
                style={{
                  background: "#1890ff",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Select Group
              </button>
            )}
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
              borderLeft: isGroup ? "2px solid #1890ff" : "none",
              paddingLeft: isGroup ? "8px" : "0",
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

      <div style={{ marginBottom: "16px" }}>
        <h3>Add Element</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {AVAILABLE_ELEMENTS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleAddElement(type)}
              style={{
                padding: "6px 12px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "3px",
                color: "#333",
                fontSize: "13px",
                minWidth: "120px",
                textAlign: "center",
                fontWeight: "bold",
                display: "block",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

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
