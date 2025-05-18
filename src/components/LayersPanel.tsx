import React, { useState, useEffect, useRef } from "react";
import type { ElementType } from "../types";
import type { KeyboardEvent, MouseEvent, DragEvent } from "react";
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
  FaArrowsUpDownLeftRight,
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
  const reorderElement = usePageBuilderStore((state) => state.reorderElement);

  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    elementId: string;
  }>({ visible: false, x: 0, y: 0, elementId: "" });

  // State for drag and drop operations
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dropTargetInfo, setDropTargetInfo] = useState<{
    parentId: string | null;
    index: number | null;
  }>({ parentId: null, index: null });

  // Add a hover state to track which element is being hovered over
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

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

  // Add an effect to reset the drag state when mouse is released outside the component
  useEffect(() => {
    const handleMouseUp = () => {
      if (draggedElementId) {
        setDraggedElementId(null);
        setDropTargetInfo({ parentId: null, index: null });
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedElementId]);

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

  const handleDragStart = (e: DragEvent<HTMLDivElement>, elementId: string) => {
    // Prevent dragging the root element
    if (elementId === rootElementId) {
      e.preventDefault();
      return;
    }

    // Find the element being dragged
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      e.preventDefault();
      return;
    }

    // Set the element being dragged
    setDraggedElementId(elementId);

    // Set drag effect and data
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", elementId);

    // Add a ghost image with element info
    const ghostElement = document.createElement("div");
    ghostElement.textContent = element.content || element.type;
    ghostElement.style.padding = "8px";
    ghostElement.style.background = "#ffffff";
    ghostElement.style.border = "1px solid #1890ff";
    ghostElement.style.borderRadius = "4px";
    ghostElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    ghostElement.style.position = "absolute";
    ghostElement.style.top = "-1000px";
    ghostElement.style.fontSize = "12px";
    ghostElement.style.fontFamily = "Arial, sans-serif";
    ghostElement.style.pointerEvents = "none";
    document.body.appendChild(ghostElement);

    e.dataTransfer.setDragImage(ghostElement, 0, 0);

    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleDragOver = (
    e: DragEvent<HTMLDivElement>,
    parentId: string,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Skip if no element is being dragged
    if (!draggedElementId) return;

    // Don't allow dropping on self or in a descendant
    if (draggedElementId === parentId) return;

    // Check if target parent is a descendant of the dragged element
    const isTargetDescendantOfDragged = (
      targetId: string,
      draggedId: string
    ): boolean => {
      const dragged = elements.find((el) => el.id === draggedId);
      if (!dragged) return false;

      // Check if target is a direct child
      if (dragged.children.includes(targetId)) return true;

      // Check if target is a descendant
      return dragged.children.some((childId) =>
        isTargetDescendantOfDragged(targetId, childId)
      );
    };

    if (isTargetDescendantOfDragged(parentId, draggedElementId)) return;

    // Set the drop effect and update target info
    e.dataTransfer.dropEffect = "move";
    setDropTargetInfo({ parentId, index });
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove visual indication
    const target = e.currentTarget;
    target.style.backgroundColor = "";
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetParentId: string,
    targetIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the dragged element ID
    const elementId = draggedElementId || e.dataTransfer.getData("text/plain");
    if (!elementId) return;

    // Skip if no element is being dragged or dropping on self
    if (elementId === targetParentId) {
      setDraggedElementId(null);
      setDropTargetInfo({ parentId: null, index: null });
      return;
    }

    // Find the element and its current parent
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      setDraggedElementId(null);
      setDropTargetInfo({ parentId: null, index: null });
      return;
    }

    const sourceParentId = element.parentId;
    if (!sourceParentId) {
      // Can't move root element
      setDraggedElementId(null);
      setDropTargetInfo({ parentId: null, index: null });
      return;
    }

    // Check if target parent is a descendant of the dragged element
    const isTargetDescendantOfDragged = (
      targetId: string,
      draggedId: string
    ): boolean => {
      const dragged = elements.find((el) => el.id === draggedId);
      if (!dragged) return false;

      // Check if target is a direct child
      if (dragged.children.includes(targetId)) return true;

      // Check if target is a descendant
      return dragged.children.some((childId) =>
        isTargetDescendantOfDragged(targetId, childId)
      );
    };

    if (isTargetDescendantOfDragged(targetParentId, elementId)) {
      console.warn("Cannot move an element into its own descendant");
      setDraggedElementId(null);
      setDropTargetInfo({ parentId: null, index: null });
      return;
    }

    // Find the source parent's children array
    const sourceParent = elements.find((el) => el.id === sourceParentId);
    const targetParent = elements.find((el) => el.id === targetParentId);

    if (!sourceParent || !targetParent) {
      setDraggedElementId(null);
      setDropTargetInfo({ parentId: null, index: null });
      return;
    }

    // Check if the element is already in the correct position
    if (sourceParentId === targetParentId) {
      const currentIndex = sourceParent.children.indexOf(elementId);

      // If moving to the same exact position or the position right after itself, do nothing
      if (
        currentIndex === targetIndex ||
        (currentIndex + 1 === targetIndex &&
          currentIndex === sourceParent.children.length - 1)
      ) {
        setDraggedElementId(null);
        setDropTargetInfo({ parentId: null, index: null });
        return;
      }

      // Log for debugging
      console.log(
        `Moving element ${elementId} within parent ${sourceParentId} from index ${currentIndex} to ${targetIndex}`
      );
    } else {
      // Log for debugging
      console.log(
        `Moving element ${elementId} from parent ${sourceParentId} to parent ${targetParentId} at index ${targetIndex}`
      );
    }

    // Execute the reorder
    try {
      reorderElement(elementId, targetParentId, targetIndex);
      console.log("Reorder operation completed successfully");
    } catch (error) {
      console.error("Error during reordering:", error);
    }

    // Reset drag state
    setDraggedElementId(null);
    setDropTargetInfo({ parentId: null, index: null });
  };

  const handleElementMouseEnter = (elementId: string) => {
    if (!draggedElementId || draggedElementId === elementId) return;
    setHoveredElementId(elementId);
  };

  const handleElementMouseLeave = () => {
    setHoveredElementId(null);
  };

  const renderDropZone = (parentId: string, index: number, isLast = false) => {
    const isActive =
      dropTargetInfo.parentId === parentId && dropTargetInfo.index === index;

    // Skip if we're trying to drag an element onto itself
    if (draggedElementId && parentId === draggedElementId) {
      return <div style={{ height: "4px" }} />;
    }

    // If dragging but not an active target, show a less visible drop zone
    const isDragging = draggedElementId !== null;

    return (
      <div
        onDragOver={(e) => handleDragOver(e, parentId, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, parentId, index)}
        style={{
          height: isActive ? "10px" : "6px",
          marginBottom: "1px",
          marginTop: isLast ? "2px" : "1px",
          backgroundColor: isActive
            ? "rgba(24, 144, 255, 0.7)"
            : isDragging
            ? "rgba(24, 144, 255, 0.1)"
            : "transparent",
          transition: "all 0.15s ease",
          position: "relative",
          borderRadius: "3px",
          zIndex: 10,
          cursor: "default",
        }}
      >
        {isActive && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "100%",
              height: "2px",
              backgroundColor: "#1890ff",
              boxShadow: "0px 0px 3px rgba(24, 144, 255, 0.5)",
            }}
          />
        )}
      </div>
    );
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
    const isDragged = draggedElementId === element.id;

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
          draggable={element.id !== rootElementId}
          onDragStart={(e) => handleDragStart(e, element.id)}
          onDragOver={(e) => handleDragOver(e, element.id, 0)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, element.id, 0)}
          onMouseEnter={() => handleElementMouseEnter(element.id)}
          onMouseLeave={handleElementMouseLeave}
          style={{
            padding: "4px 8px",
            backgroundColor: isSelected
              ? "#e6f7ff"
              : isDragged
              ? "rgba(24, 144, 255, 0.2)"
              : hoveredElementId === element.id
              ? "rgba(24, 144, 255, 0.1)"
              : dropTargetInfo.parentId === element.id
              ? "rgba(24, 144, 255, 0.1)"
              : "transparent",
            border: isMultiSelected
              ? "1px dashed #1890ff"
              : isDragged
              ? "1px solid #1890ff"
              : hoveredElementId === element.id
              ? "1px solid rgba(24, 144, 255, 0.5)"
              : "1px solid transparent",
            marginBottom: "2px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor:
              element.id === rootElementId
                ? "default"
                : draggedElementId
                ? "grabbing"
                : "grab",
            borderRadius: "4px",
            minWidth: "fit-content",
            height: "28px",
            opacity: isDragged ? 0.5 : 1,
            transition: "all 0.15s ease",
            transform:
              hoveredElementId === element.id && draggedElementId
                ? "translateX(3px)"
                : "translateX(0)",
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
              {element.id !== rootElementId && (
                <FaArrowsUpDownLeftRight
                  size={10}
                  style={{ marginLeft: "2px" }}
                />
              )}
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
              {element.children.map((childId, index) => (
                <React.Fragment key={`fragment-${childId}-${index}`}>
                  {renderDropZone(element.id, index)}
                  {renderElementTree(childId, depth + 1)}
                  {/* Add a drop zone after the last child as well */}
                  {index === element.children.length - 1 &&
                    renderDropZone(element.id, index + 1, true)}
                </React.Fragment>
              ))}

              {/* If there are no children, still add a drop zone */}
              {element.children.length === 0 &&
                renderDropZone(element.id, 0, true)}
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
