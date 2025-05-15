# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# Basic Page Builder

A flexible and intuitive page builder that allows you to create web pages without writing code. Built with React 19 and TypeScript, it features a drag-and-drop interface and real-time preview.

## Features

- Two-panel layout with layers panel and preview screen
- Flex-based layout system
- Add various HTML elements (headings, paragraphs, divs, etc.)
- Group elements together
- Style elements with a comprehensive style editor
- Apply flex layout properties (direction, alignment, justification)
- Real-time preview
- Export HTML and CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/basic-page-builder.git
cd basic-page-builder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## How to Use

1. **Add Elements**: Click on any element type in the layers panel to add it to your page.

2. **Select and Edit**: Click on an element in the preview screen or in the layers panel to select it and edit its properties.

3. **Group Elements**: Hold Ctrl/Cmd and click multiple elements, then click "Group Selected Elements" to group them.

4. **Style Elements**: Use the style editor to change properties like:

   - Display type (flex, block, etc.)
   - Flex properties (direction, justify-content, align-items)
   - Box model (width, height, padding, margin)
   - Visual properties (colors, fonts, borders)

5. **Export**: Use the export panel to:
   - Copy HTML or CSS to clipboard
   - Download HTML file
   - Download CSS file
   - Download complete webpage (HTML with CSS)

## Project Structure

```
basic-page-builder/
├── src/
│   ├── components/         # React components
│   │   ├── LayersPanel.tsx   # Left sidebar with element tree
│   │   ├── PreviewScreen.tsx # Right side preview
│   │   ├── StyleEditor.tsx   # Element styling controls
│   │   └── ExportPanel.tsx   # Export controls
│   ├── store/              # State management
│   │   └── pageBuilderStore.ts  # Zustand store
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # Type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
└── public/                 # Static assets
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vite](https://vitejs.dev/) - Build tool
