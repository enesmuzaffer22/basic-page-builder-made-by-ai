# Basic Page Builder

A user-friendly and intuitive page builder that allows you to create web pages without writing code. Built with React 19 and TypeScript, it features an accessible interface and real-time preview for anyone who wants to design web pages.

## Features

- **Two-Panel Interface**: Layers panel and preview screen
- **Layers Panel**: View and organize your page elements hierarchically
- **Preview Screen**: See your changes in real-time
- **Style Editor**: Comprehensive customization options
- **Flex-based Layout System**: Compatible with modern web design
- **Element Adding**: Headings, paragraphs, divs, buttons, links, and more
- **Element Grouping**: Combine elements and manage them as a group
- **Naming**: Give custom names to any element or group
- **Nesting**: Easily nest elements within each other
- **Flex Properties**: Control direction, alignment, and distribution
- **Export**: Export your HTML and CSS code

## Getting Started

### Requirements

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

### Adding and Editing Elements

1. **Add Elements**: Click on the appropriate element type in the layers panel to add a new element.
2. **Select Elements**: Click on an element in the preview screen or in the layers panel to select it.
3. **Edit Content**: Use the style editor to change text content.
4. **Delete Elements**: Click on the "Delete" button next to an element to remove it.

### Grouping and Editing

1. **Group Elements**: Hold Ctrl/Cmd while clicking on elements to select multiple, then click the "Group Selected Elements" button.
2. **Name Groups**: You can give custom names to groups and divs in the style editor.
3. **Edit Group Content**: Groups behave like other elements and can be edited.

### Style Editing

Use the style editor to change the following properties:

- **Layout Type**: Flex, block, inline, etc.
- **Flex Properties**: Direction, alignment, distribution, wrap
- **Box Model**: Width, height, padding, margin
- **Visual Properties**: Colors, fonts, borders
- **Text Properties**: Font size, weight, alignment

### Exporting

You can export your projects in different formats:

- HTML code
- CSS code
- Complete web page (HTML + CSS)

## Project Structure

```
basic-page-builder/
├── src/
│   ├── components/            # React components
│   │   ├── LayersPanel.tsx    # Layers panel
│   │   ├── PreviewScreen.tsx  # Preview screen
│   │   ├── StyleEditor.tsx    # Style editor
│   │   └── ExportPanel.tsx    # Export panel
│   ├── store/                 # State management
│   │   └── pageBuilderStore.ts # Zustand store
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # Type definitions
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
└── public/                    # Static assets
```

## Technologies Used

- [React 19](https://react.dev/) - User interface
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Icons](https://react-icons.github.io/react-icons/) - Icons
- [UUID](https://github.com/uuidjs/uuid) - Unique ID generation
- [Vite](https://vitejs.dev/) - Development tool

## Developer Notes

This project is designed to allow users without web development skills to easily create web pages. Currently, basic features are available, and more element types, customization options, and template support will be added in the future.

## License

This project is licensed under the MIT License.

---

© 2024 Basic Page Builder
