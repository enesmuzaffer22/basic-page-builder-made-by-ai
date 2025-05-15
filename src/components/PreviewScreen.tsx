import React, { useMemo, useEffect } from "react";
import { usePageBuilderStore } from "../store/pageBuilderStore";
import type { ElementStyle, ElementType } from "../types";

// This interface reflects the same structure as PageElementTree in the store
interface PageElementTree {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children: PageElementTree[];
  parentId: string | null;
  isGroup?: boolean;
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
    const { id, type, content, style, children, isGroup } = element;

    console.log(
      `Rendering element: ${id}, type: ${type}, children: ${children.length}`
    );

    const isSelected = selectedElementId === id;

    // Apply special styling for groups - only show distinct group styling when selected
    const elementStyle = {
      ...style,
      outline: isSelected ? "2px solid #1890ff" : "none",
      minHeight: children.length === 0 ? "20px" : undefined,
      minWidth: children.length === 0 ? "20px" : undefined,
      padding: style.padding || (isGroup ? "8px" : "4px"),
      boxSizing: "border-box" as const,
      position: "relative" as const,
      background:
        isGroup && isSelected ? "rgba(24, 144, 255, 0.05)" : style.background,
      border: isGroup
        ? isSelected
          ? "1px dashed #1890ff"
          : "none"
        : style.border,
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
          Group
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
          content || `${type} Element`,
        ]);

      case "a":
        return React.createElement(
          "a",
          { ...elementProps, href: "#", target: "_blank" },
          [groupLabel, content || "Link"]
        );

      case "img":
        return React.createElement("img", {
          ...elementProps,
          src: "https://via.placeholder.com/150",
          alt: "Preview image",
        });

      case "ul":
      case "ol":
        return React.createElement(
          type,
          elementProps,
          childElements.length > 0
            ? [groupLabel, ...childElements]
            : [
                groupLabel,
                ...[1, 2, 3].map((i) => <li key={i}>List item {i}</li>),
              ]
        );

      case "li":
        return React.createElement(type, elementProps, [
          groupLabel,
          content || "List item",
        ]);

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        padding: "20px",
        background: "#fff",
        overflow: "auto",
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "1px dashed #ddd",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {renderElement(elementTree)}
      </div>
    </div>
  );
};

export default PreviewScreen;
