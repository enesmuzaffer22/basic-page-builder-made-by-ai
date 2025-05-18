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
  groupName?: string;
  listItems?: string[]; // For list items (ul, ol)
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
  groupName?: string;
  listItems?: string[]; // For list items (ul, ol)
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
  updateElementName: (id: string, name: string) => void;
  deleteElement: (id: string) => void;
  groupElements: (elementIds: string[]) => void;
  getElementsTree: () => PageElementTree;
  generateHTML: () => string;
  generateCSS: () => string;

  // List management
  addListItem: (listId: string, content?: string) => void;
  updateListItem: (listId: string, index: number, content: string) => void;
  deleteListItem: (listId: string, index: number) => void;
  reorderListItem: (listId: string, oldIndex: number, newIndex: number) => void;
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
  const navbarId = uuidv4();
  const logoId = uuidv4();
  const linksContainerId = uuidv4();
  const link1Id = uuidv4();
  const link2Id = uuidv4();
  const link3Id = uuidv4();

  return {
    elements: [
      // Root container
      {
        id: rootId,
        type: "div",
        style: {
          ...defaultStyles,
          width: "100%",
          height: "100%",
        },
        children: [navbarId],
        parentId: null,
        content: "Page Container",
      },
      // Navbar
      {
        id: navbarId,
        type: "div",
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "#f8f9fa",
          width: "100%",
          borderBottom: "1px solid #dee2e6",
        },
        children: [logoId, linksContainerId],
        parentId: rootId,
        content: "Navbar",
      },
      // Logo
      {
        id: logoId,
        type: "h1",
        style: {
          margin: "0",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
        },
        children: [],
        parentId: navbarId,
        content: "Logo",
      },
      // Links container
      {
        id: linksContainerId,
        type: "div",
        style: {
          display: "flex",
          flexDirection: "row",
          gap: "20px",
        },
        children: [link1Id, link2Id, link3Id],
        parentId: navbarId,
        content: "Links Container",
      },
      // Link 1
      {
        id: link1Id,
        type: "a",
        style: {
          color: "#0d6efd",
          textDecoration: "none",
          fontSize: "16px",
        },
        children: [],
        parentId: linksContainerId,
        content: "Home",
      },
      // Link 2
      {
        id: link2Id,
        type: "a",
        style: {
          color: "#0d6efd",
          textDecoration: "none",
          fontSize: "16px",
        },
        children: [],
        parentId: linksContainerId,
        content: "About",
      },
      // Link 3
      {
        id: link3Id,
        type: "a",
        style: {
          color: "#0d6efd",
          textDecoration: "none",
          fontSize: "16px",
        },
        children: [],
        parentId: linksContainerId,
        content: "Contact",
      },
    ],
    selectedElementId: null,
    rootElementId: rootId,

    addElement: (type: ElementType, parentId?: string) => {
      const effectiveParentId = parentId || get().rootElementId;

      // Generate content based on element type
      let elementContent: string | undefined;
      let defaultListItems: string[] | undefined;

      // Create default styles based on element type
      let elementStyle: ElementStyle = { ...defaultStyles };

      // Apply type-specific default styles
      if (type === "div" || type === "section") {
        // For container elements
        elementStyle = {
          ...elementStyle,
          padding: "4px",
          minHeight: "20px",
          minWidth: "20px",
        };
      } else if (type === "h1") {
        elementStyle = {
          ...elementStyle,
          fontSize: "2rem",
          fontWeight: "bold",
          margin: "0 0 1rem 0",
        };
      } else if (type === "h2") {
        elementStyle = {
          ...elementStyle,
          fontSize: "1.75rem",
          fontWeight: "bold",
          margin: "0 0 0.875rem 0",
        };
      } else if (type === "h3") {
        elementStyle = {
          ...elementStyle,
          fontSize: "1.5rem",
          fontWeight: "bold",
          margin: "0 0 0.75rem 0",
        };
      } else if (type === "p") {
        elementStyle = {
          ...elementStyle,
          fontSize: "1rem",
          margin: "0 0 1rem 0",
        };
      } else if (type === "a") {
        elementStyle = {
          ...elementStyle,
          color: "#1890ff",
          textDecoration: "none",
        };
      } else if (type === "button") {
        elementStyle = {
          ...elementStyle,
          padding: "0.5rem 1rem",
          backgroundColor: "#212529", // Siyah buton arka planı (önizleme ile eşleşmesi için)
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%", // Butonun genişliğini tam genişlik olarak ayarla
          textAlign: "center",
        };
      } else if (type === "img") {
        elementStyle = {
          ...elementStyle,
          width: "150px",
          height: "auto",
          objectFit: "contain",
        };
      } else if (type === "ul" || type === "ol") {
        elementStyle = {
          ...elementStyle,
          paddingLeft: "30px",
          listStylePosition: "outside",
          listStyleType: type === "ul" ? "disc" : "decimal",
          maxWidth: "100%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          margin: "0 0 1rem 0",
        };
      } else if (type === "li") {
        elementStyle = {
          ...elementStyle,
          display: "list-item",
          maxWidth: "100%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          marginLeft: "0",
        };
      } else if (type === "span") {
        elementStyle = {
          ...elementStyle,
          display: "inline",
        };
      }

      if (type === "div") {
        // Count existing divs (excluding the root div) to generate the next number
        const existingDivs = get().elements.filter(
          (el) => el.type === "div" && el.id !== get().rootElementId
        ).length;
        const nextDivNumber = existingDivs + 1;
        elementContent = `Div ${nextDivNumber}`;
      } else if (type === "section") {
        const existingSections = get().elements.filter(
          (el) => el.type === "section"
        ).length;
        const nextSectionNumber = existingSections + 1;
        elementContent = `Section ${nextSectionNumber}`;
      } else if (type === "span") {
        const existingSpans = get().elements.filter(
          (el) => el.type === "span"
        ).length;
        const nextSpanNumber = existingSpans + 1;
        elementContent = `Span ${nextSpanNumber}`;
      } else if (type === "button") {
        const existingButtons = get().elements.filter(
          (el) => el.type === "button"
        ).length;
        const nextButtonNumber = existingButtons + 1;
        elementContent = `Button ${nextButtonNumber}`;
      } else if (type === "a") {
        const existingLinks = get().elements.filter(
          (el) => el.type === "a"
        ).length;
        const nextLinkNumber = existingLinks + 1;
        elementContent = `Link ${nextLinkNumber}`;
      } else if (type === "img") {
        const existingImages = get().elements.filter(
          (el) => el.type === "img"
        ).length;
        const nextImageNumber = existingImages + 1;
        elementContent = `Image ${nextImageNumber}`;
      } else if (type === "ul" || type === "ol") {
        const existingLists = get().elements.filter(
          (el) => el.type === "ul" || el.type === "ol"
        ).length;
        const nextListNumber = existingLists + 1;
        elementContent = `List ${nextListNumber}`;

        // Create default list items
        defaultListItems = ["List item 1", "List item 2", "List item 3"];
      } else if (type === "li") {
        const existingItems = get().elements.filter(
          (el) => el.type === "li"
        ).length;
        const nextItemNumber = existingItems + 1;
        elementContent = `Item ${nextItemNumber}`;
      } else if (
        type === "p" ||
        type === "h1" ||
        type === "h2" ||
        type === "h3"
      ) {
        elementContent = "Double click to edit text";
      }

      const newElement: PageElementRef = {
        id: uuidv4(),
        type,
        style: elementStyle,
        children: [],
        parentId: effectiveParentId,
        content: elementContent,
        listItems: defaultListItems,
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

    updateElementName: (id, name) => {
      set((state) => ({
        elements: state.elements.map((el) => {
          if (el.id === id) {
            // Eğer grup ise hem groupName hem de content'i güncelle
            if (el.isGroup) {
              return { ...el, groupName: name, content: name };
            } else {
              return { ...el, content: name };
            }
          }
          return el;
        }),
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

        // Find the next group number
        const existingGroups = state.elements.filter((el) => el.isGroup).length;
        const nextGroupNumber = existingGroups + 1;
        const groupName = `Group ${nextGroupNumber}`;

        const groupId = uuidv4();
        const groupElement: PageElementRef = {
          id: groupId,
          type: "div",
          style: {
            ...defaultStyles,
            display: "flex",
            flexDirection: "row",
            padding: "4px",
          },
          children: elementIds,
          parentId,
          isGroup: true,
          groupName: groupName,
          content: groupName,
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
        const { type, content, children, id, listItems } = element;

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

        // Handle special case for images
        if (type === "img") {
          return `<img class="${styleClass}" src="https://via.placeholder.com/150" alt="Image">`;
        }

        // For list elements (ul, ol)
        if (type === "ul" || type === "ol") {
          // Build list style attributes
          const listTypeStyle = type === "ul" ? "disc" : "decimal";

          // If there are specific list items, render them
          if (listItems && listItems.length > 0) {
            const listItemsHTML = listItems
              .map(
                (item) =>
                  `<li style="display: list-item; word-break: break-word; overflow-wrap: break-word;">${item}</li>`
              )
              .join("");
            return `<${type} class="${styleClass}" style="list-style-type: ${listTypeStyle};">${listItemsHTML}${childrenHTML}</${type}>`;
          }
          // Fallback if no list items defined
          return `<${type} class="${styleClass}" style="list-style-type: ${listTypeStyle};">
            <li style="display: list-item; word-break: break-word; overflow-wrap: break-word;">List item 1</li>
            <li style="display: list-item; word-break: break-word; overflow-wrap: break-word;">List item 2</li>
            <li style="display: list-item; word-break: break-word; overflow-wrap: break-word;">List item 3</li>
            ${childrenHTML}
          </${type}>`;
        }

        // For text content elements
        if (
          ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "button"].includes(
            type
          )
        ) {
          return `<${type} class="${styleClass}">${displayContent}${childrenHTML}</${type}>`;
        }

        // Special case for links
        if (type === "a") {
          return `<a class="${styleClass}" href="#" target="_blank">${displayContent}${childrenHTML}</a>`;
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
* {
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
  color: #333;
  margin: 0;
  padding: 0;
}

.page-container {
  width: 100%;
  max-width: none !important;
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
  background-color: #212529;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

ul, ol {
  padding-left: 30px;
  margin-bottom: 1rem;
  list-style-position: outside;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
}

li {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  margin-left: 0;
  display: list-item;
}

img {
  max-width: 100%;
  height: auto;
}
`;

      // Generate element-specific CSS
      const elementCSS = elements
        .map((el) => {
          // Filter out editor-specific styles
          const cleanStyle = { ...el.style };

          // Remove editor-specific styles
          delete cleanStyle.outline;
          delete cleanStyle.zIndex;

          // Only remove these borders if they're the editor's selection borders
          if (
            cleanStyle.border === "1px dashed #1890ff" ||
            cleanStyle.border === "2px solid #1890ff"
          ) {
            delete cleanStyle.border;
          }

          // Only remove background if it's related to selection styling
          if (cleanStyle.background === "#1890ff") {
            delete cleanStyle.background;
          }

          // Ensure minimum dimensions for elements that should have them
          if (
            (el.type === "div" || el.type === "section") &&
            !el.children.length
          ) {
            if (!cleanStyle.minHeight) cleanStyle.minHeight = "20px";
            if (!cleanStyle.minWidth) cleanStyle.minWidth = "20px";
          }

          // Default padding for container elements if not specified
          if (
            !cleanStyle.padding &&
            (el.type === "div" || el.type === "section")
          ) {
            cleanStyle.padding = "4px";
          }

          // Apply specific style enhancements based on element type
          switch (el.type) {
            case "ul":
            case "ol":
              // Ensure lists have correct styling
              cleanStyle.listStylePosition =
                cleanStyle.listStylePosition || "outside";
              cleanStyle.paddingLeft = cleanStyle.paddingLeft || "30px";
              cleanStyle.maxWidth = cleanStyle.maxWidth || "100%";
              cleanStyle.wordBreak = cleanStyle.wordBreak || "break-word";
              cleanStyle.overflowWrap = cleanStyle.overflowWrap || "break-word";
              cleanStyle.listStyleType =
                cleanStyle.listStyleType ||
                (el.type === "ul" ? "disc" : "decimal");
              cleanStyle.margin = cleanStyle.margin || "0 0 1rem 0";
              break;

            case "li":
              // List item specific styling
              cleanStyle.maxWidth = cleanStyle.maxWidth || "100%";
              cleanStyle.wordBreak = cleanStyle.wordBreak || "break-word";
              cleanStyle.overflowWrap = cleanStyle.overflowWrap || "break-word";
              cleanStyle.marginLeft = cleanStyle.marginLeft || "0";
              cleanStyle.display = cleanStyle.display || "list-item";
              break;

            case "img":
              // Image specific styling
              cleanStyle.width = cleanStyle.width || "150px";
              cleanStyle.height = cleanStyle.height || "auto";
              cleanStyle.objectFit = cleanStyle.objectFit || "contain";
              break;

            case "p":
              // Paragraph styling
              cleanStyle.fontSize = cleanStyle.fontSize || "1rem";
              cleanStyle.margin = cleanStyle.margin || "0 0 1rem 0";
              break;

            case "a":
              // Link styling
              cleanStyle.color = cleanStyle.color || "#1890ff";
              cleanStyle.textDecoration = cleanStyle.textDecoration || "none";
              break;

            case "button":
              // Button styling
              if (!cleanStyle.padding) cleanStyle.padding = "0.5rem 1rem";
              if (!cleanStyle.background && !cleanStyle.backgroundColor)
                cleanStyle.backgroundColor = "#212529"; // Siyah buton arka planı
              if (!cleanStyle.color) cleanStyle.color = "white";
              if (!cleanStyle.border) cleanStyle.border = "none";
              if (!cleanStyle.borderRadius) cleanStyle.borderRadius = "4px";
              if (!cleanStyle.cursor) cleanStyle.cursor = "pointer";
              if (!cleanStyle.width) cleanStyle.width = "100%";
              if (!cleanStyle.textAlign) cleanStyle.textAlign = "center";
              break;

            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              // Headings styling
              if (!cleanStyle.fontSize) {
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
              if (!cleanStyle.margin) {
                switch (el.type) {
                  case "h1":
                    cleanStyle.margin = "0 0 1rem 0";
                    break;
                  case "h2":
                    cleanStyle.margin = "0 0 0.875rem 0";
                    break;
                  case "h3":
                    cleanStyle.margin = "0 0 0.75rem 0";
                    break;
                  default:
                    cleanStyle.margin = "0 0 0.5rem 0";
                    break;
                }
              }
              if (!cleanStyle.fontWeight) cleanStyle.fontWeight = "bold";
              break;
          }

          // Ensure flex containers have proper display settings
          if (cleanStyle.flexDirection && !cleanStyle.display) {
            cleanStyle.display = "flex";
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

    addListItem: (listId: string, content?: string) => {
      set((state) => {
        const listElement = state.elements.find((el) => el.id === listId);
        if (
          !listElement ||
          (listElement.type !== "ul" && listElement.type !== "ol")
        ) {
          console.error(`Element with ID ${listId} not found or is not a list`);
          return state;
        }

        // Generate default content for new list item
        const itemContent =
          content || `Item ${(listElement.listItems?.length || 0) + 1}`;

        // Create a new list items array or append to existing
        const updatedListItems = [
          ...(listElement.listItems || []),
          itemContent,
        ];

        return {
          elements: state.elements.map((el) =>
            el.id === listId ? { ...el, listItems: updatedListItems } : el
          ),
        };
      });
    },

    updateListItem: (listId: string, index: number, content: string) => {
      set((state) => {
        const listElement = state.elements.find((el) => el.id === listId);
        if (
          !listElement ||
          !listElement.listItems ||
          index >= listElement.listItems.length
        ) {
          console.error(
            `Cannot update list item: element not found or invalid index`
          );
          return state;
        }

        const updatedListItems = [...listElement.listItems];
        updatedListItems[index] = content;

        return {
          elements: state.elements.map((el) =>
            el.id === listId ? { ...el, listItems: updatedListItems } : el
          ),
        };
      });
    },

    deleteListItem: (listId: string, index: number) => {
      set((state) => {
        const listElement = state.elements.find((el) => el.id === listId);
        if (
          !listElement ||
          !listElement.listItems ||
          index >= listElement.listItems.length
        ) {
          console.error(
            `Cannot delete list item: element not found or invalid index`
          );
          return state;
        }

        const updatedListItems = [...listElement.listItems];
        updatedListItems.splice(index, 1);

        // If this was the last list item, delete the list element itself
        if (updatedListItems.length === 0) {
          // First, get the list element's parent
          const parentId = listElement.parentId;
          if (!parentId) return state; // Safety check

          // Make sure parent exists
          const parentElement = state.elements.find((el) => el.id === parentId);
          if (!parentElement) return state;

          // Update parent's children list (remove the list element's ID)
          let updatedElements = state.elements.map((el) => {
            if (el.id === parentId) {
              return {
                ...el,
                children: el.children.filter((childId) => childId !== listId),
              };
            }
            return el;
          });

          // Remove the list element from the elements array
          updatedElements = updatedElements.filter((el) => el.id !== listId);

          return {
            elements: updatedElements,
            selectedElementId: parentId, // Select parent after deletion
          };
        }

        // Otherwise just update the list items
        return {
          elements: state.elements.map((el) =>
            el.id === listId ? { ...el, listItems: updatedListItems } : el
          ),
        };
      });
    },

    reorderListItem: (listId: string, oldIndex: number, newIndex: number) => {
      set((state) => {
        const listElement = state.elements.find((el) => el.id === listId);
        if (
          !listElement ||
          !listElement.listItems ||
          oldIndex >= listElement.listItems.length ||
          newIndex >= listElement.listItems.length
        ) {
          console.error(
            `Cannot reorder list item: element not found or invalid index`
          );
          return state;
        }

        const updatedListItems = [...listElement.listItems];
        const [movedItem] = updatedListItems.splice(oldIndex, 1);
        updatedListItems.splice(newIndex, 0, movedItem);

        return {
          elements: state.elements.map((el) =>
            el.id === listId ? { ...el, listItems: updatedListItems } : el
          ),
        };
      });
    },
  };
});

// Export the store
export { usePageBuilderStore };
export default usePageBuilderStore;
