export type ElementType =
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "a"
  | "img"
  | "ul"
  | "ol"
  | "li"
  | "button"
  | "span"
  | "section";

export type FlexDirection = "row" | "column";
export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type Gap = string; // '0px', '10px', etc.

export interface ElementStyle {
  display?: "flex" | "block" | "inline" | "inline-block" | "none" | "list-item";
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexWrap?: FlexWrap;
  gap?: Gap;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginBottom?: string;
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  paddingInlineStart?: string;
  backgroundColor?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textDecoration?: "none" | "underline" | "line-through" | "overline";
  border?: string;
  borderWidth?: string;
  borderStyle?:
    | "none"
    | "solid"
    | "dashed"
    | "dotted"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
  borderColor?: string;
  borderRadius?: string;
  borderBottom?: string;
  borderTop?: string;
  borderLeft?: string;
  borderRight?: string;
  outline?: string; // Editor özel stili
  boxSizing?: "border-box" | "content-box";
  position?: "relative" | "absolute" | "fixed" | "sticky";
  zIndex?: string | number;
  wordBreak?: "normal" | "break-all" | "break-word" | "keep-all";
  overflowWrap?: "normal" | "break-word";
  listStyleType?:
    | "disc"
    | "circle"
    | "square"
    | "decimal"
    | "decimal-leading-zero"
    | "none";
  listStylePosition?: "inside" | "outside";
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  cursor?: "pointer" | "default" | "text" | "move" | "not-allowed";
  transition?: string;
  lineHeight?: string;
  flex?: string | number;
}

export interface PageElement {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children: PageElement[];
  parentId: string | null;
  isGroup?: boolean;
}

export interface Project {
  name: string;
  rootElement: PageElement;
  selectedElementId: string | null;
}
