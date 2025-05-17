import React, { useState, useEffect, useRef } from "react";
import type { ElementType } from "../types";
import type { KeyboardEvent, MouseEvent } from "react";
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

// Metin kısaltma yardımcı fonksiyonu
const truncateText = (text: string, maxLength: number = 25) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    elementId: string;
  }>({ visible: false, x: 0, y: 0, elementId: "" });

  // Reference to the layers panel
  const layersPanelRef = useRef<HTMLDivElement>(null);

  // Debug info
  useEffect(() => {
    console.log("Current elements in LayersPanel:", elements);
    console.log("Root element ID:", rootElementId);
    console.log("Selected element ID:", selectedElementId);
  }, [elements, rootElementId, selectedElementId]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  // Handle keyboard events for deleting elements
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "Delete" &&
      selectedElementId &&
      selectedElementId !== rootElementId
    ) {
      console.log(`Deleting element with keyboard: ${selectedElementId}`);
      deleteElement(selectedElementId);
    }
  };

  // Handle context menu
  const handleContextMenu = (e: MouseEvent, elementId: string) => {
    if (elementId === rootElementId) return; // Don't show context menu for root element

    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      elementId: elementId,
    });
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

    // Başlıkları kısalt
    const truncatedDisplayName = truncateText(displayName);
    const truncatedContentPreview = truncateText(contentPreview, 20);

    // Calculate consistent indentation
    const INDENT_WIDTH = 16; // Fixed indentation width for all levels

    return (
      <div
        key={element.id}
        style={{
          marginLeft: depth === 0 ? 0 : `${INDENT_WIDTH}px`, // No margin for root, fixed width for all others
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            padding: "4px 8px",
            backgroundColor: isSelected ? "#e6f7ff" : "transparent",
            border: isMultiSelected
              ? "1px dashed #1890ff"
              : "1px solid transparent",
            marginBottom: "2px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: "4px",
            minWidth: "fit-content",
            height: "28px",
          }}
          onClick={(e) =>
            handleElementSelect(element.id, e.ctrlKey || e.metaKey)
          }
          onContextMenu={(e) => handleContextMenu(e, element.id)}
        >
          <div
            style={{
              fontWeight: isSelected ? "bold" : "normal",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexGrow: 1,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                padding: "2px 4px",
                backgroundColor: "#eee",
                borderRadius: "3px",
                fontSize: "12px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
                height: "20px",
              }}
            >
              <span className="element-icon">{icon}</span>
            </span>
            {truncatedDisplayName && (
              <span
                style={{
                  fontSize: "12px",
                  flexShrink: 0,
                  marginRight: "6px",
                  whiteSpace: "nowrap",
                  height: "16px",
                  lineHeight: "16px",
                }}
                title={displayName}
              >
                {truncatedDisplayName}
              </span>
            )}
            {truncatedContentPreview && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontStyle: "italic",
                  flexGrow: 1,
                  paddingLeft: "4px",
                  borderLeft: contentPreview ? "1px solid #ddd" : "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: "16px",
                  lineHeight: "16px",
                  maxWidth: "100px",
                }}
                title={contentPreview}
              >
                {truncatedContentPreview}
              </span>
            )}
          </div>
        </div>

        {element.children.length > 0 && (
          <div
            style={{
              paddingLeft: 0, // Reset padding
              marginLeft: 0, // Reset margin
              position: "relative", // For precise control of the vertical line
            }}
          >
            {/* Vertical line for children */}
            <div
              style={{
                position: "absolute",
                left: "7px", // Position the line precisely
                top: "0",
                bottom: "8px",
                width: "2px",
                backgroundColor: "#e8e8e8",
              }}
            />

            <div style={{ marginLeft: `${INDENT_WIDTH}px` }}>
              {element.children.map((childId) =>
                renderElementTree(childId, depth + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={layersPanelRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width: "300px",
        height: "100%",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        background: "#f5f5f5",
        overflowY: "auto",
        overflowX: "auto",
        outline: "none",
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

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          width: "100%",
          paddingRight: "8px",
        }}
      >
        <h3>Structure</h3>
        {renderElementTree(rootElementId)}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            borderRadius: "4px",
            padding: "8px 0",
            zIndex: 1000,
          }}
        >
          <div
            onClick={() => {
              deleteElement(contextMenu.elementId);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#ff4d4f" }}>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
