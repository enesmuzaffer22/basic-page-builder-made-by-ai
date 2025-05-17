import React, { useMemo, useEffect } from "react";
import { usePageBuilderStore } from "../store/pageBuilderStore";
import type { ElementStyle, ElementType } from "../types";

// Global styles for preview to match exported result
const previewStyles = {
  allElements: {
    boxSizing: "border-box" as const,
  },
  listElements: {
    maxWidth: "100%",
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    paddingLeft: "30px", // Ensure space for markers
    listStylePosition: "outside" as const, // Place markers outside of the list item box
  },
  listItemElements: {
    maxWidth: "100%",
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    marginLeft: "0", // Reset any margin that might hide markers
  },
};

// This interface reflects the same structure as PageElementTree in the store
interface PageElementTree {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children: PageElementTree[];
  parentId: string | null;
  isGroup?: boolean;
  groupName?: string;
  listItems?: string[];
}

const PreviewScreen: React.FC = () => {
  // Extract everything we need from the store at the top level
  const selectedElementId = usePageBuilderStore(
    (state) => state.selectedElementId
  );
  const selectElement = usePageBuilderStore((state) => state.selectElement);
  const getElementsTree = usePageBuilderStore((state) => state.getElementsTree);
  const elements = usePageBuilderStore((state) => state.elements);

  // Get the complete element tree using useMemo to prevent unnecessary recalculations
  const elementTree = useMemo(
    () => getElementsTree(),
    [getElementsTree, elements]
  );

  // Debug: Log the element tree and elements array
  useEffect(() => {
    console.log("Elements array in PreviewScreen:", elements);
    console.log("Element tree in PreviewScreen:", elementTree);
  }, [elements, elementTree]);

  if (!elementTree) {
    console.error("Element tree is null or undefined");
    return <div>Error: Could not build element tree</div>;
  }

  const renderElement = (element: PageElementTree): React.ReactNode => {
    const {
      id,
      type,
      content,
      style,
      children,
      isGroup,
      groupName,
      listItems,
    } = element;

    console.log(
      `Rendering element: ${id}, type: ${type}, children: ${children.length}`
    );

    const isSelected = selectedElementId === id;

    // Apply special styling for lists and list items
    let additionalStyles = {};
    if (type === "ul" || type === "ol") {
      additionalStyles = previewStyles.listElements;
    } else if (type === "li") {
      additionalStyles = previewStyles.listItemElements;
    }

    // Apply special styling for groups - only show distinct group styling when selected
    const elementStyle = {
      ...previewStyles.allElements,
      ...style,
      ...additionalStyles,
      outline: isSelected ? "2px solid #1890ff" : "none",
      minHeight: children.length === 0 ? "20px" : undefined,
      minWidth: children.length === 0 ? "20px" : undefined,
      padding: style.padding || "4px",
      position: "relative" as const,
      background: style.background || style.backgroundColor,
      backgroundColor: style.backgroundColor,
      border: isSelected ? "1px dashed #1890ff" : style.border,
    };

    // Add a visual indicator for groups - only when selected
    const groupLabel =
      isGroup && isSelected ? (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "10px",
            background: "#1890ff",
            color: "white",
            padding: "2px 8px",
            fontSize: "10px",
            borderRadius: "2px",
            zIndex: 1,
            fontWeight: "bold",
          }}
        >
          {groupName || "Group"}
        </div>
      ) : null;

    // Get child elements
    const childElements = children.map((child) => renderElement(child));

    // Create props for the element
    const elementProps = {
      key: id,
      style: elementStyle,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        selectElement(id);
      },
    };

    // Clean and prepare content similar to export function
    const cleanContent = content
      ? content.replace("Double click to edit text", "")
      : "";
    const displayContent =
      cleanContent ||
      (type === "p"
        ? "Paragraph text"
        : type.startsWith("h")
        ? `${type.toUpperCase()} Heading`
        : type === "a"
        ? "Link text"
        : type === "button"
        ? "Button"
        : "");

    // Render the appropriate element based on type
    switch (type) {
      case "div":
      case "section":
        return React.createElement(type, elementProps, [
          groupLabel,
          ...childElements,
        ]);

      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
      case "p":
      case "span":
      case "button":
        return React.createElement(type, elementProps, [
          groupLabel,
          displayContent,
        ]);

      case "a":
        return React.createElement(
          "a",
          { ...elementProps, href: "#", target: "_blank" },
          [groupLabel, displayContent]
        );

      case "img":
        return React.createElement("img", {
          ...elementProps,
          src: "https://via.placeholder.com/150",
          alt: "Preview image",
        });

      case "ul":
      case "ol": {
        // Adjust list specific styles
        const listTypeStyle =
          type === "ul"
            ? { listStyleType: "disc" } // Explicit disc for ul
            : { listStyleType: "decimal" }; // Explicit decimal for ol

        // Update element props with list style
        const listElementProps = {
          ...elementProps,
          style: {
            ...elementProps.style,
            ...listTypeStyle,
            paddingInlineStart: "30px", // Ensure space for markers in all browsers
          },
        };

        // Render list items from listItems array if available
        const listItemElements =
          listItems && listItems.length > 0
            ? listItems.map((item, index) => (
                <li
                  key={`${id}-item-${index}`}
                  style={{
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    display: "list-item", // Ensure list item behavior
                  }}
                >
                  {item}
                </li>
              ))
            : [1, 2, 3].map((i) => (
                <li
                  key={i}
                  style={{
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    display: "list-item", // Ensure list item behavior
                  }}
                >
                  List item {i}
                </li>
              ));

        return React.createElement(type, listElementProps, [
          groupLabel,
          ...listItemElements,
          ...childElements,
        ]);
      }

      case "li":
        return React.createElement(
          type,
          {
            ...elementProps,
            style: {
              ...elementProps.style,
              display: "list-item", // Ensure list item behavior
            },
          },
          [groupLabel, displayContent || "List item"]
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        padding: "16px",
        background: "#fff",
        overflow: "auto",
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
        ...previewStyles.allElements,
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "400px",
          border: "1px dashed #ddd",
          position: "relative",
          overflow: "hidden",
          ...previewStyles.allElements,
        }}
      >
        {renderElement(elementTree)}
      </div>
    </div>
  );
};

export default PreviewScreen;
