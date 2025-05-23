# Basic Page Builder

A user-friendly and intuitive page builder that allows you to create web pages without writing code. Built with React 19 and TypeScript, this drag-and-drop editor features a real-time preview interface for creating modern web pages.

## AI Development

This project was developed with the assistance of artificial intelligence:

- **AI Tool**: Cursor Agent
- **AI Model**: Claude 3.7 Sonnet by Anthropic

The AI assistance was used to help design the architecture, implement features, and debug the application while following modern React and TypeScript best practices.

## Features

- **Dual-Panel Interface**:
  - **Layers Panel**: Hierarchical view of all page elements
  - **Preview Screen**: Real-time visualization of your design
- **Advanced Element Management**:
  - Add various HTML elements (headings, paragraphs, divs, buttons, links, etc.)
  - Group elements for easier management
  - Custom naming for better organization
  - Nested element support for complex layouts
- **Style Controls**:
  - Comprehensive style editor with visual controls
  - Flexbox layout management (direction, alignment, distribution, wrapping)
  - Complete box model control (width, height, margin, padding)
  - Detailed typography settings
  - Color management
  - Border styling
- **Export Options**:
  - Export clean HTML code
  - Export optimized CSS
  - Export complete web page
- **Project Management**:

  - Save and manage multiple page projects
  - User authentication
  - Project dashboard

- **Additional Features**:
  - Undo/redo functionality
  - Keyboard shortcuts

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

### Creating Pages

1. **Sign in** to your account
2. Navigate to the **Dashboard**
3. Create a **New Page** or select an existing one
4. Use the **Editor** to design your page

### Adding and Editing Elements

1. **Add Elements**: Select element types from the layers panel
2. **Select Elements**: Click on any element in the preview or layers panel
3. **Edit Content**: Modify text content directly in the style editor
4. **Remove Elements**: Use the delete button in the element controls

### Styling Elements

Use the comprehensive Style Editor to adjust:

- **Layout**: Type, direction, alignment, wrapping
- **Box Model**: Width, height, margin, padding
- **Typography**: Font, size, weight, style, alignment
- **Appearance**: Colors, backgrounds, borders
- **Position**: Relative, absolute positioning

### Organizing Elements

1. **Group Elements**: Select multiple elements and use the group function
2. **Name Elements**: Give descriptive names to elements and groups
3. **Reorder Elements**: Drag and drop in the layers panel

### Exporting Your Work

1. Navigate to the **Export Panel**
2. Choose your export format (HTML, CSS, or complete page)
3. Copy the code or download the files

## Project Structure

```
basic-page-builder/
├── src/
│   ├── components/            # React components
│   │   ├── LayersPanel.tsx    # Layers panel component
│   │   ├── PreviewScreen.tsx  # Preview screen component
│   │   ├── StyleEditor.tsx    # Style editor component
│   │   ├── ExportPanel.tsx    # Export functionality
│   │   ├── Auth/              # Authentication components
│   │   ├── Dashboard/         # Project management components
│   │   └── LandingPage/       # Landing page components
│   ├── store/                 # State management
│   │   ├── pageBuilderStore.ts # Element styling and structure
│   │   ├── authStore.ts       # Authentication state
│   │   └── pagesStore.ts      # Page management
│   ├── types/                 # TypeScript definitions
│   ├── firebase/              # Firebase integration
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
└── public/                    # Static assets
```

## Technologies Used

- [React 19](https://react.dev/) - User interface library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Router](https://reactrouter.com/) - Navigation
- [Firebase](https://firebase.google.com/) - Authentication and storage
- [UUID](https://github.com/uuidjs/uuid) - Unique ID generation
- [Vite](https://vitejs.dev/) - Build tool and development server

## License

This project is licensed under the MIT License.

---

© 2024 Basic Page Builder
