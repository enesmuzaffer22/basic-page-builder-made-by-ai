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
  display?: "flex" | "block" | "inline" | "inline-block" | "none";
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexWrap?: FlexWrap;
  gap?: Gap;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  border?: string;
  borderRadius?: string;
  outline?: string; // Editor özel stili
  boxSizing?: "border-box" | "content-box";
  position?: "relative" | "absolute" | "fixed" | "sticky";
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
