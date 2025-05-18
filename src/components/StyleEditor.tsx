import React, { useState } from "react";
import { usePageBuilderStore } from "../store/pageBuilderStore";
import type {
  ElementStyle,
  FlexDirection,
  JustifyContent,
  AlignItems,
  FlexWrap,
} from "../types";

// CSS Units for measurement inputs
const CSS_UNITS = ["px", "rem", "em", "%", "vw", "vh", ""];

// Helper function to parse CSS value and unit
const parseCssValue = (
  cssValue: string | undefined
): { value: string; unit: string } => {
  if (!cssValue) return { value: "", unit: "px" };

  // Check for complex values (multiple values separated by spaces)
  if (cssValue.includes(" ")) {
    // For now, return the whole string without unit separation
    return { value: cssValue, unit: "" };
  }

  // Match any number followed by a unit
  const match = cssValue.match(/^(-?\d*\.?\d*)([a-z%]*)$/);

  if (match) {
    const [, value, unit = "px"] = match;
    return { value, unit };
  }

  // If it's just a number, return with default unit px
  if (!isNaN(Number(cssValue))) {
    return { value: cssValue, unit: "px" };
  }

  // For invalid formats, try to extract just the numeric part if possible
  const numericMatch = cssValue.match(/(-?\d*\.?\d*)/);
  if (numericMatch && numericMatch[1]) {
    return { value: numericMatch[1], unit: "px" };
  }

  // For complex values or invalid formats, return as is with empty unit
  return { value: cssValue, unit: "" };
};

// CSS Measurement Input Component
interface MeasurementInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  supportMultipleValues?: boolean;
}

const MeasurementInput: React.FC<MeasurementInputProps> = ({
  value,
  onChange,
  placeholder,
  supportMultipleValues = false,
}) => {
  // Parse the CSS value to extract number and unit
  const parsed = parseCssValue(value);

  // Use state to remember the selected unit even when value is empty
  const [selectedUnit, setSelectedUnit] = useState(parsed.unit);

  // For properties that support multiple values (like margin, padding)
  if (supportMultipleValues && value && value.includes(" ")) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "e.g. 10px 20px 15px"}
        style={{ width: "100%", padding: "8px" }}
      />
    );
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow only numeric values and decimal point
    if (newValue !== "" && !/^-?\d*\.?\d*$/.test(newValue)) {
      return;
    }

    // When input is empty, just set an empty value without unit
    if (!newValue) {
      onChange("");
      return;
    }

    // Keep the user's selected unit when changing the value
    onChange(`${newValue}${selectedUnit}`);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    // Remember the selected unit
    setSelectedUnit(newUnit);

    // Don't add unit if there's no value
    if (!parsed.value) {
      return;
    }

    // Apply the new unit to the current value
    onChange(`${parsed.value}${newUnit}`);
  };

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <input
        type="text"
        value={parsed.value}
        onChange={handleValueChange}
        placeholder={placeholder || "Value"}
        style={{ flex: 1, padding: "8px" }}
      />
      <select
        value={selectedUnit}
        onChange={handleUnitChange}
        style={{ width: "70px", padding: "8px" }}
      >
        {CSS_UNITS.map((u) => (
          <option key={u || "empty-unit"} value={u}>
            {u || "none"}
          </option>
        ))}
      </select>
    </div>
  );
};

const StyleEditor: React.FC = () => {
  const {
    elements,
    selectedElementId,
    updateElementStyle,
    updateElementContent,
    updateElementName,
    addListItem,
    updateListItem,
    deleteListItem,
    reorderListItem,
  } = usePageBuilderStore();

  // State for new list item
  const [newListItem, setNewListItem] = useState("");

  if (!selectedElementId) {
    return (
      <div className="style-editor-panel" style={{ boxSizing: "border-box" }}>
        <p>Select an element to edit its style</p>
      </div>
    );
  }

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  if (!selectedElement) return null;

  const { type, style, content, isGroup, groupName, listItems } =
    selectedElement;

  const handleStyleChange = <T extends string | number>(
    property: keyof ElementStyle,
    value: T
  ) => {
    // Birbiriyle ilişkili özellikleri yönet
    if (
      property === "border" &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      // Border shorthand kullanıldığında, ilgili özellikleri temizle
      // Kullanıcı örn. "1px solid red" girdiğinde, borderWidth, borderStyle, borderColor temizlenir
      updateElementStyle(selectedElementId, {
        [property]: value,
        borderWidth: undefined,
        borderStyle: undefined,
        borderColor: undefined,
      });
      return;
    }

    // Border özellikleri değiştirildiğinde border shorthand'i güncelle
    if (
      property === "borderWidth" ||
      property === "borderStyle" ||
      property === "borderColor"
    ) {
      const currentStyle = { ...style };
      const updatedProp = { [property]: value };
      const updatedStyle = { ...currentStyle, ...updatedProp };

      // Tüm border özellikleri varsa, shorthand'i otomatik oluştur
      if (
        updatedStyle.borderWidth &&
        updatedStyle.borderStyle &&
        updatedStyle.borderColor
      ) {
        const borderShorthand = `${updatedStyle.borderWidth} ${updatedStyle.borderStyle} ${updatedStyle.borderColor}`;
        updateElementStyle(selectedElementId, {
          ...updatedProp,
          border: borderShorthand,
        });
        return;
      }
    }

    // Padding shorthand kullanıldığında, ilgili özellikleri temizle
    if (
      property === "padding" &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      updateElementStyle(selectedElementId, {
        [property]: value,
        paddingTop: undefined,
        paddingRight: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined,
      });
      return;
    }

    // Margin shorthand kullanıldığında, ilgili özellikleri temizle
    if (
      property === "margin" &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      updateElementStyle(selectedElementId, {
        [property]: value,
        marginTop: undefined,
        marginRight: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
      });
      return;
    }

    // Tek bir taraf değiştirildiğinde, shorthand'i sil
    if (
      ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].includes(
        property as string
      ) &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      updateElementStyle(selectedElementId, {
        [property]: value,
        padding: undefined,
      });
      return;
    }

    if (
      ["marginTop", "marginRight", "marginBottom", "marginLeft"].includes(
        property as string
      ) &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      updateElementStyle(selectedElementId, {
        [property]: value,
        margin: undefined,
      });
      return;
    }

    // Normal durumlarda sadece belirtilen özelliği güncelle
    updateElementStyle(selectedElementId, { [property]: value });
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateElementContent(selectedElementId, e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElementName(selectedElementId, e.target.value);
  };

  // List item handlers
  const handleAddListItem = () => {
    if (newListItem.trim()) {
      addListItem(selectedElementId, newListItem.trim());
      setNewListItem("");
    } else {
      addListItem(selectedElementId);
    }
  };

  const handleUpdateListItem = (index: number, value: string) => {
    updateListItem(selectedElementId, index, value);
  };

  const handleDeleteListItem = (index: number) => {
    deleteListItem(selectedElementId, index);
  };

  const handleMoveListItem = (index: number, direction: "up" | "down") => {
    if (!listItems) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < listItems.length) {
      reorderListItem(selectedElementId, index, newIndex);
    }
  };

  // Element için gösterilecek adı belirle
  const displayName = isGroup ? groupName : content;

  return (
    <div className="style-editor-panel" style={{ boxSizing: "border-box" }}>
      <h3>Style Editor - {type}</h3>

      {/* Element name editor for divs and groups */}
      {(type === "div" || isGroup) && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Element Name
          </label>
          <input
            type="text"
            value={displayName || ""}
            onChange={handleNameChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder={isGroup ? "Group Name" : "Div Name"}
          />
        </div>
      )}

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

      {/* List item editor for lists */}
      {(type === "ul" || type === "ol") && (
        <div style={{ marginBottom: "16px" }}>
          <h4>List Items</h4>

          {/* Existing list items */}
          <div style={{ marginBottom: "12px" }}>
            {listItems && listItems.length > 0 ? (
              listItems.map((item, index) => (
                <div
                  key={`list-item-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "8px",
                    }}
                  >
                    <button
                      onClick={() => handleMoveListItem(index, "up")}
                      disabled={index === 0}
                      style={{
                        padding: "4px",
                        background: index === 0 ? "#f0f0f0" : "#e6f7ff",
                        border: "1px solid #d9d9d9",
                        cursor: index === 0 ? "default" : "pointer",
                        borderRadius: "4px 4px 0 0",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveListItem(index, "down")}
                      disabled={index === listItems.length - 1}
                      style={{
                        padding: "4px",
                        background:
                          index === listItems.length - 1
                            ? "#f0f0f0"
                            : "#e6f7ff",
                        border: "1px solid #d9d9d9",
                        cursor:
                          index === listItems.length - 1
                            ? "default"
                            : "pointer",
                        borderRadius: "0 0 4px 4px",
                        borderTop: "none",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      ▼
                    </button>
                  </div>
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleUpdateListItem(index, e.target.value)
                    }
                    style={{ flex: 1, padding: "8px" }}
                  />
                  <button
                    onClick={() => handleDeleteListItem(index)}
                    style={{
                      padding: "6px 10px",
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#888" }}>No list items. Add some below.</p>
            )}
          </div>

          {/* Add new list item */}
          <div style={{ display: "flex", marginBottom: "8px" }}>
            <input
              type="text"
              value={newListItem}
              onChange={(e) => setNewListItem(e.target.value)}
              placeholder="New list item"
              style={{ flex: 1, padding: "8px", marginRight: "8px" }}
            />
            <button
              onClick={handleAddListItem}
              style={{
                padding: "8px 16px",
                background: "#1890ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Item
            </button>
          </div>
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
              <MeasurementInput
                value={style.gap}
                onChange={(value) => handleStyleChange("gap", value)}
                placeholder="Gap value"
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
          <MeasurementInput
            value={style.width}
            onChange={(value) => handleStyleChange("width", value)}
            placeholder="Width value"
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Height
          </label>
          <MeasurementInput
            value={style.height}
            onChange={(value) => handleStyleChange("height", value)}
            placeholder="Height value"
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontWeight: "bold",
            }}
          >
            Padding
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Top
              </label>
              <MeasurementInput
                value={style.paddingTop}
                onChange={(value) => handleStyleChange("paddingTop", value)}
                placeholder="Top"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Right
              </label>
              <MeasurementInput
                value={style.paddingRight}
                onChange={(value) => handleStyleChange("paddingRight", value)}
                placeholder="Right"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Bottom
              </label>
              <MeasurementInput
                value={style.paddingBottom}
                onChange={(value) => handleStyleChange("paddingBottom", value)}
                placeholder="Bottom"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Left
              </label>
              <MeasurementInput
                value={style.paddingLeft}
                onChange={(value) => handleStyleChange("paddingLeft", value)}
                placeholder="Left"
              />
            </div>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "2px",
              }}
            >
              All sides (shorthand)
            </label>
            <MeasurementInput
              value={style.padding}
              onChange={(value) => handleStyleChange("padding", value)}
              placeholder="All padding values"
              supportMultipleValues={true}
            />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontWeight: "bold",
            }}
          >
            Margin
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Top
              </label>
              <MeasurementInput
                value={style.marginTop}
                onChange={(value) => handleStyleChange("marginTop", value)}
                placeholder="Top"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Right
              </label>
              <MeasurementInput
                value={style.marginRight}
                onChange={(value) => handleStyleChange("marginRight", value)}
                placeholder="Right"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Bottom
              </label>
              <MeasurementInput
                value={style.marginBottom}
                onChange={(value) => handleStyleChange("marginBottom", value)}
                placeholder="Bottom"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Left
              </label>
              <MeasurementInput
                value={style.marginLeft}
                onChange={(value) => handleStyleChange("marginLeft", value)}
                placeholder="Left"
              />
            </div>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "2px",
              }}
            >
              All sides (shorthand)
            </label>
            <MeasurementInput
              value={style.margin}
              onChange={(value) => handleStyleChange("margin", value)}
              placeholder="All margin values"
              supportMultipleValues={true}
            />
          </div>
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
          <MeasurementInput
            value={style.fontSize}
            onChange={(value) => handleStyleChange("fontSize", value)}
            placeholder="Font size value"
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

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontWeight: "bold",
            }}
          >
            Border
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Width
              </label>
              <MeasurementInput
                value={style.borderWidth}
                onChange={(value) => handleStyleChange("borderWidth", value)}
                placeholder="Width"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Style
              </label>
              <select
                value={style.borderStyle || ""}
                onChange={(e) =>
                  handleStyleChange("borderStyle", e.target.value)
                }
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="">Default</option>
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="groove">Groove</option>
                <option value="ridge">Ridge</option>
                <option value="inset">Inset</option>
                <option value="outset">Outset</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "2px",
                }}
              >
                Color
              </label>
              <input
                type="color"
                value={style.borderColor || "#000000"}
                onChange={(e) =>
                  handleStyleChange("borderColor", e.target.value)
                }
                style={{ width: "100%", padding: "4px" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "2px",
              }}
            >
              Shorthand (all borders)
            </label>
            <input
              type="text"
              value={style.border || ""}
              onChange={(e) => handleStyleChange("border", e.target.value)}
              placeholder="e.g. 1px solid black"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Border Radius
          </label>
          <MeasurementInput
            value={style.borderRadius}
            onChange={(value) => handleStyleChange("borderRadius", value)}
            placeholder="Border radius value"
          />
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
