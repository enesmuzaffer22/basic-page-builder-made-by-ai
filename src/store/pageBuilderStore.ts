import { create } from "zustand";
import type { ElementStyle, ElementType } from "../types";
import { v4 as uuidv4 } from "uuid";

// Extending the PageElement interface to handle ID references
interface PageElementRef {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children: string[]; // Store IDs of children
  parentId: string | null;
  isGroup?: boolean;
}

// For the tree representation
interface PageElementTree {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children: PageElementTree[]; // Actual child elements
  parentId: string | null;
  isGroup?: boolean;
}

interface PageBuilderState {
  elements: PageElementRef[];
  selectedElementId: string | null;
  rootElementId: string;

  // Actions
  addElement: (type: ElementType, parentId?: string) => void;
  selectElement: (id: string | null) => void;
  updateElementStyle: (id: string, style: Partial<ElementStyle>) => void;
  updateElementContent: (id: string, content: string) => void;
  deleteElement: (id: string) => void;
  groupElements: (elementIds: string[]) => void;
  getElementsTree: () => PageElementTree;
  generateHTML: () => string;
  generateCSS: () => string;
}

const defaultStyles: ElementStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "0",
  margin: "0",
};

// Create the store
const usePageBuilderStore = create<PageBuilderState>((set, get) => {
  // Create root element
  const rootId = uuidv4();

  return {
    elements: [
      {
        id: rootId,
        type: "div",
        style: {
          ...defaultStyles,
          width: "100%",
          height: "100%",
        },
        children: [],
        parentId: null,
      },
    ],
    selectedElementId: null,
    rootElementId: rootId,

    addElement: (type: ElementType, parentId?: string) => {
      const effectiveParentId = parentId || get().rootElementId;

      const newElement: PageElementRef = {
        id: uuidv4(),
        type,
        style: { ...defaultStyles },
        children: [],
        parentId: effectiveParentId,
        content:
          type === "p" || type === "h1" || type === "h2" || type === "h3"
            ? "Double click to edit text"
            : undefined,
      };

      console.log("Adding new element:", newElement);
      console.log("Parent ID:", effectiveParentId);

      set((state) => {
        // Find parent to ensure it exists
        const parentElement = state.elements.find(
          (el) => el.id === effectiveParentId
        );
        if (!parentElement) {
          console.error(
            `Parent element with ID ${effectiveParentId} not found`
          );
          return state;
        }

        // Update parent with new child ID
        const updatedElements = state.elements.map((el) => {
          if (el.id === effectiveParentId) {
            console.log(
              "Updating parent:",
              el.id,
              "Adding child:",
              newElement.id
            );
            return {
              ...el,
              children: [...el.children, newElement.id],
            };
          }
          return el;
        });

        console.log("Updated elements:", [...updatedElements, newElement]);

        return {
          elements: [...updatedElements, newElement],
          selectedElementId: newElement.id,
        };
      });
    },

    selectElement: (id) => {
      set({ selectedElementId: id });
    },

    updateElementStyle: (id, style) => {
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, style: { ...el.style, ...style } } : el
        ),
      }));
    },

    updateElementContent: (id, content) => {
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, content } : el
        ),
      }));
    },

    deleteElement: (id) => {
      set((state) => {
        // Don't allow deleting the root element
        if (id === state.rootElementId) return state;

        // Find the element to delete
        const elementToDelete = state.elements.find((el) => el.id === id);
        if (!elementToDelete) return state;

        const parentId = elementToDelete.parentId;
        // If no parent is found, don't delete (safety check)
        if (!parentId) return state;

        // Get all descendant IDs to remove
        const getDescendantIds = (elementId: string): string[] => {
          const element = state.elements.find((el) => el.id === elementId);
          if (!element) return [];

          let descendants: string[] = [elementId];

          // Collect all children IDs recursively
          element.children.forEach((childId) => {
            descendants = [...descendants, ...getDescendantIds(childId)];
          });

          return descendants;
        };

        const idsToRemove = getDescendantIds(id);

        // Update the parent's children list by removing the deleted element's ID
        const updatedElements = state.elements.map((el) => {
          if (el.id === parentId) {
            return {
              ...el,
              children: el.children.filter((childId) => childId !== id),
            };
          }
          return el;
        });

        // Filter out the element to delete and all its children
        const elementsToKeep = updatedElements.filter(
          (el) => !idsToRemove.includes(el.id)
        );

        return {
          elements: elementsToKeep,
          selectedElementId: parentId,
        };
      });
    },

    groupElements: (elementIds) => {
      if (elementIds.length < 2) return;

      set((state) => {
        // Create a new group element
        const firstElement = state.elements.find(
          (el) => el.id === elementIds[0]
        );
        if (!firstElement) return state;

        const parentId = firstElement.parentId;
        if (!parentId) return state;

        const groupId = uuidv4();
        const groupElement: PageElementRef = {
          id: groupId,
          type: "div",
          style: {
            ...defaultStyles,
            display: "flex",
            flexDirection: "row",
            padding: "8px",
            border: "1px dashed #1890ff",
            borderRadius: "4px",
            background: "rgba(24, 144, 255, 0.05)",
          },
          children: elementIds,
          parentId,
          isGroup: true,
        };

        // Update the parent's children list
        let updatedElements = state.elements.map((el) => {
          if (el.id === parentId) {
            return {
              ...el,
              children: el.children
                .filter((childId) => !elementIds.includes(childId))
                .concat(groupId),
            };
          }
          return el;
        });

        // Update the children's parent reference
        updatedElements = updatedElements.map((el) => {
          if (elementIds.includes(el.id)) {
            return {
              ...el,
              parentId: groupId,
            };
          }
          return el;
        });

        return {
          elements: [...updatedElements, groupElement],
          selectedElementId: groupId,
        };
      });
    },

    getElementsTree: () => {
      const { elements, rootElementId } = get();

      const buildTree = (elementId: string): PageElementTree => {
        const element = elements.find((el) => el.id === elementId);
        if (!element) {
          console.error(`Element with id ${elementId} not found`);
          // Return a placeholder element instead of throwing
          return {
            id: "error-element",
            type: "div",
            style: {},
            children: [],
            parentId: null,
          };
        }

        const children: PageElementTree[] = [];
        for (const childId of element.children) {
          const child = elements.find((el) => el.id === childId);
          if (child) {
            children.push(buildTree(child.id));
          } else {
            console.warn(`Child with id ${childId} not found`);
          }
        }

        return {
          ...element,
          children,
        };
      };

      try {
        return buildTree(rootElementId);
      } catch (error) {
        console.error("Error building element tree:", error);
        // Return a basic root element if there's an error
        return {
          id: rootElementId,
          type: "div",
          style: { width: "100%", height: "100%" },
          children: [],
          parentId: null,
        };
      }
    },

    generateHTML: () => {
      const rootElement = get().getElementsTree();

      const generateElementHTML = (element: PageElementTree): string => {
        const { type, content, children, id } = element;

        const childrenHTML = children.map(generateElementHTML).join("");

        // Use a clean class name
        const styleClass = `element-${id}`;

        // Clean and prepare content
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

        // For text content elements
        if (
          [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "span",
            "a",
            "button",
          ].includes(type)
        ) {
          return `<${type} class="${styleClass}">${displayContent}${childrenHTML}</${type}>`;
        }

        // For container elements - no special treatment for groups in exported HTML
        return `<${type} class="${styleClass}">${childrenHTML}</${type}>`;
      };

      return generateElementHTML(rootElement);
    },

    generateCSS: () => {
      const { elements } = get();

      // Create a base CSS with default font styles
      const baseCSS = `
/* Base styles for consistent text rendering */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
  color: #333;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 0.875rem;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

a {
  color: #1890ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

ul, ol {
  padding-left: 2rem;
  margin-bottom: 1rem;
}
`;

      // Generate element-specific CSS
      const elementCSS = elements
        .map((el) => {
          // Filter out editor-specific styles (outline, border for groups, etc.) that should not appear in exported code
          const cleanStyle = { ...el.style };

          // Don't include editor styling in export
          delete cleanStyle.outline; // Remove outline for all elements

          if (el.isGroup) {
            // For groups, preserve essential styles but remove editor-specific styling
            delete cleanStyle.border;
            delete cleanStyle.background; // Remove highlight background
          }

          // Remove positioning properties used only for editing
          delete cleanStyle.position;
          delete cleanStyle.boxSizing;

          // Ensure font sizing is consistent for text elements
          if (el.type === "p" && !cleanStyle.fontSize) {
            cleanStyle.fontSize = "1rem";
          }

          if (
            ["h1", "h2", "h3", "h4", "h5", "h6"].includes(el.type) &&
            !cleanStyle.fontSize
          ) {
            switch (el.type) {
              case "h1":
                cleanStyle.fontSize = "2rem";
                break;
              case "h2":
                cleanStyle.fontSize = "1.75rem";
                break;
              case "h3":
                cleanStyle.fontSize = "1.5rem";
                break;
              case "h4":
                cleanStyle.fontSize = "1.25rem";
                break;
              case "h5":
                cleanStyle.fontSize = "1.1rem";
                break;
              case "h6":
                cleanStyle.fontSize = "1rem";
                break;
            }
          }

          const styleProperties = Object.entries(cleanStyle)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => {
              // Convert camelCase to kebab-case
              const property = key.replace(/([A-Z])/g, "-$1").toLowerCase();
              return `${property}: ${value};`;
            })
            .join("\n  ");

          return `.element-${el.id} {\n  ${styleProperties}\n}`;
        })
        .join("\n\n");

      return baseCSS + "\n\n" + elementCSS;
    },
  };
});

// Export the store
export { usePageBuilderStore };
export default usePageBuilderStore;
