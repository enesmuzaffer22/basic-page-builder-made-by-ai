import React from "react";
import { usePageBuilderStore } from "../store/pageBuilderStore";
import type {
  ElementStyle,
  FlexDirection,
  JustifyContent,
  AlignItems,
  FlexWrap,
} from "../types";

const StyleEditor: React.FC = () => {
  const {
    elements,
    selectedElementId,
    updateElementStyle,
    updateElementContent,
  } = usePageBuilderStore();

  if (!selectedElementId) {
    return (
      <div
        style={{
          padding: "16px",
          background: "#f5f5f5",
          borderTop: "1px solid #ddd",
        }}
      >
        <p>Select an element to edit its style</p>
      </div>
    );
  }

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  if (!selectedElement) return null;

  const { type, style, content } = selectedElement;

  const handleStyleChange = <T extends string | number>(
    property: keyof ElementStyle,
    value: T
  ) => {
    updateElementStyle(selectedElementId, { [property]: value });
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateElementContent(selectedElementId, e.target.value);
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f5f5",
        borderTop: "1px solid #ddd",
        overflowY: "auto",
        maxHeight: "30vh",
      }}
    >
      <h3>Style Editor - {type}</h3>

      {/* Content editor for text elements */}
      {(type === "h1" ||
        type === "h2" ||
        type === "h3" ||
        type === "p" ||
        type === "button" ||
        type === "a" ||
        type === "span") && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Content
          </label>
          <textarea
            value={content || ""}
            onChange={handleContentChange}
            style={{ width: "100%", padding: "8px", minHeight: "60px" }}
          />
        </div>
      )}

      {/* Flex Container Properties */}
      <div style={{ marginBottom: "16px" }}>
        <h4>Flex Container</h4>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Display
          </label>
          <select
            value={style.display || "flex"}
            onChange={(e) => handleStyleChange("display", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="flex">Flex</option>
            <option value="block">Block</option>
            <option value="inline">Inline</option>
            <option value="inline-block">Inline Block</option>
            <option value="none">None</option>
          </select>
        </div>

        {style.display === "flex" && (
          <>
            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Flex Direction
              </label>
              <select
                value={style.flexDirection || "column"}
                onChange={(e) =>
                  handleStyleChange(
                    "flexDirection",
                    e.target.value as FlexDirection
                  )
                }
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Justify Content
              </label>
              <select
                value={style.justifyContent || "flex-start"}
                onChange={(e) =>
                  handleStyleChange(
                    "justifyContent",
                    e.target.value as JustifyContent
                  )
                }
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="flex-start">Flex Start</option>
                <option value="flex-end">Flex End</option>
                <option value="center">Center</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Align Items
              </label>
              <select
                value={style.alignItems || "stretch"}
                onChange={(e) =>
                  handleStyleChange("alignItems", e.target.value as AlignItems)
                }
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="flex-start">Flex Start</option>
                <option value="flex-end">Flex End</option>
                <option value="center">Center</option>
                <option value="stretch">Stretch</option>
                <option value="baseline">Baseline</option>
              </select>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Flex Wrap
              </label>
              <select
                value={style.flexWrap || "nowrap"}
                onChange={(e) =>
                  handleStyleChange("flexWrap", e.target.value as FlexWrap)
                }
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="nowrap">No Wrap</option>
                <option value="wrap">Wrap</option>
                <option value="wrap-reverse">Wrap Reverse</option>
              </select>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Gap
              </label>
              <input
                type="text"
                value={style.gap || "0px"}
                onChange={(e) => handleStyleChange("gap", e.target.value)}
                placeholder="e.g. 10px"
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </>
        )}
      </div>

      {/* Box Model Properties */}
      <div style={{ marginBottom: "16px" }}>
        <h4>Box Model</h4>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Width</label>
          <input
            type="text"
            value={style.width || ""}
            onChange={(e) => handleStyleChange("width", e.target.value)}
            placeholder="e.g. 100%, 200px"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Height
          </label>
          <input
            type="text"
            value={style.height || ""}
            onChange={(e) => handleStyleChange("height", e.target.value)}
            placeholder="e.g. 100%, 200px"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Padding
          </label>
          <input
            type="text"
            value={style.padding || ""}
            onChange={(e) => handleStyleChange("padding", e.target.value)}
            placeholder="e.g. 10px, 10px 20px"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Margin
          </label>
          <input
            type="text"
            value={style.margin || ""}
            onChange={(e) => handleStyleChange("margin", e.target.value)}
            placeholder="e.g. 10px, 10px 20px"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      </div>

      {/* Visual Properties */}
      <div style={{ marginBottom: "16px" }}>
        <h4>Visual Properties</h4>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Background Color
          </label>
          <input
            type="color"
            value={style.backgroundColor || "#ffffff"}
            onChange={(e) =>
              handleStyleChange("backgroundColor", e.target.value)
            }
            style={{ width: "100%", padding: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Text Color
          </label>
          <input
            type="color"
            value={style.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            style={{ width: "100%", padding: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Font Size
          </label>
          <input
            type="text"
            value={style.fontSize || ""}
            onChange={(e) => handleStyleChange("fontSize", e.target.value)}
            placeholder="e.g. 16px, 1.2rem"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Font Weight
          </label>
          <select
            value={style.fontWeight || ""}
            onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Default</option>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Text Align
          </label>
          <select
            value={style.textAlign || ""}
            onChange={(e) =>
              handleStyleChange(
                "textAlign",
                e.target.value as "left" | "center" | "right" | "justify"
              )
            }
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Border
          </label>
          <input
            type="text"
            value={style.border || ""}
            onChange={(e) => handleStyleChange("border", e.target.value)}
            placeholder="e.g. 1px solid black"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Border Radius
          </label>
          <input
            type="text"
            value={style.borderRadius || ""}
            onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
            placeholder="e.g. 4px, 50%"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
