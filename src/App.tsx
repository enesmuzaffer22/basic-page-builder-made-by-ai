import { useEffect, useState, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import AuthPage from "./components/Auth/AuthPage";
import WelcomeScreen from "./components/Dashboard/WelcomeScreen";
import LayersPanel from "./components/LayersPanel";
import PreviewScreen from "./components/PreviewScreen";
import StyleEditor from "./components/StyleEditor";
import ExportPanel from "./components/ExportPanel";
import ResponsiveWarning from "./components/ResponsiveWarning";
import { useAuthStore } from "./store/authStore";
import { usePagesStore } from "./store/pagesStore";
import { usePageBuilderStore } from "./store/pageBuilderStore";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Only navigate away if we're not still loading and there's no user
      navigate("/auth", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="loading-screen">Redirecting to login...</div>;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAuthStore();
  const { currentPageId, updatePage, pages } = usePagesStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);
  const undo = usePageBuilderStore((state) => state.undo);
  const redo = usePageBuilderStore((state) => state.redo);

  // Get current page title
  const currentPage = pages.find((page) => page.id === currentPageId);
  const currentPageTitle = currentPage?.title || "";

  // If user is logged in but not on a specific page, redirect to dashboard
  useEffect(() => {
    if (user && !currentPageId && window.location.pathname === "/editor") {
      navigate("/dashboard");
    }
  }, [user, currentPageId, navigate]);

  // Save page data when navigating away from editor
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentPageId && location.pathname === "/editor") {
        updatePage(currentPageId);
      }
    };

    // Save when leaving the page completely
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentPageId, updatePage, location.pathname]);

  // Monitor location changes to detect when leaving the editor
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    // If we're navigating away from editor, save the page
    if (
      prevPathRef.current === "/editor" &&
      location.pathname !== "/editor" &&
      currentPageId
    ) {
      updatePage(currentPageId);
    }

    // Update the previous path
    prevPathRef.current = location.pathname;
  }, [location.pathname, currentPageId, updatePage]);

  // Show loading state when entering editor
  useEffect(() => {
    if (location.pathname === "/editor" && currentPageId) {
      setPageLoading(true);
      // Give time for data to load
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPageId]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "z"
      ) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          <ResponsiveWarning>
            <AuthPage />
          </ResponsiveWarning>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ResponsiveWarning>
            <ProtectedRoute>
              <WelcomeScreen />
            </ProtectedRoute>
          </ResponsiveWarning>
        }
      />
      <Route
        path="/editor"
        element={
          <ResponsiveWarning>
            <ProtectedRoute>
              {currentPageId ? (
                pageLoading ? (
                  <div className="loading-editor">
                    <h2>Loading page...</h2>
                  </div>
                ) : (
                  <div className="app-container">
                    <header
                      className="app-header"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h1 style={{ margin: 0 }}>
                        Page Builder - {currentPageTitle}
                      </h1>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          aria-label="Undo"
                          className="undo-btn"
                          onClick={undo}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              transform: "scaleX(-1)",
                            }}
                          >
                            ↻
                          </span>
                        </button>
                        <button
                          aria-label="Redo"
                          className="redo-btn"
                          onClick={redo}
                        >
                          ↻
                        </button>
                      </div>
                    </header>

                    <main className="app-main">
                      <LayersPanel />
                      <div className="app-right-panel">
                        <PreviewScreen />
                        <ExportPanel />
                      </div>
                      <StyleEditor />
                    </main>
                  </div>
                )
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          </ResponsiveWarning>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
