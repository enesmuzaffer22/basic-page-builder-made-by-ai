import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { usePagesStore } from "../../store/pagesStore";
import { FiFileText, FiPlus, FiEdit, FiLogOut } from "react-icons/fi";
import "../../styles/Dashboard.css";

interface NewPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const NewPageModal = ({ isOpen, onClose, onCreate }: NewPageModalProps) => {
  const [title, setTitle] = useState("");
  const { error } = usePagesStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title);
    }
  };

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Page</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="page-title">Page Title</label>
            <input
              id="page-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="button-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const { user, logout } = useAuthStore();
  const {
    pages,
    loading,
    error,
    fetchUserPages,
    createPage,
    setCurrentPageId,
    setError,
  } = usePagesStore();

  // Fetch user pages when component mounts
  useEffect(() => {
    if (user) {
      fetchUserPages(user.uid);
    }
  }, [user, fetchUserPages]);

  const handleCreatePage = async (title: string) => {
    if (user) {
      const pageId = await createPage(user.uid, title);
      if (pageId) {
        // Clear any errors and close modal on success
        setError(null);
        setShowNewPageModal(false);
        navigate("/editor");
      }
      // If pageId is empty, there was an error which is already set in the store
    }
  };

  const handleOpenPage = (pageId: string) => {
    setCurrentPageId(pageId);
    navigate("/editor");
  };

  return (
    <div className="welcome-screen">
      <header className="welcome-header">
        <div className="welcome-title">
          <h1>Page Builder</h1>
          {user && <p>Welcome, {user.email}</p>}
        </div>
        <button onClick={logout} className="logout-button">
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="welcome-content">
        {error && !showNewPageModal && (
          <div className="error-message global-error">
            {error}
            <button
              className="close-error-btn"
              onClick={() => setError(null)}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <section className="start-section">
          <h2>Start</h2>
          <div className="action-cards">
            <div
              className="action-card"
              onClick={() => setShowNewPageModal(true)}
            >
              <FiPlus className="action-icon" />
              <div className="action-details">
                <h3>Create a New Page</h3>
                <p>Start with a blank page</p>
              </div>
            </div>
            {pages.length > 0 && (
              <div
                className="action-card"
                onClick={() => handleOpenPage(pages[pages.length - 1].id)}
              >
                <FiEdit className="action-icon" />
                <div className="action-details">
                  <h3>Open Recent Page</h3>
                  <p>{pages[pages.length - 1].title}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="recent-section">
          <h2>Recent Pages</h2>
          {loading ? (
            <div className="loading-message">Loading your pages...</div>
          ) : pages.length === 0 ? (
            <div className="empty-message">
              <p>You haven't created any pages yet.</p>
              <button
                className="button-primary"
                onClick={() => setShowNewPageModal(true)}
              >
                Create your first page
              </button>
            </div>
          ) : (
            <div className="pages-list">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="page-item"
                  onClick={() => handleOpenPage(page.id)}
                >
                  <FiFileText className="page-icon" />
                  <div className="page-details">
                    <h3>{page.title}</h3>
                    <p>
                      Last edited:{" "}
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <NewPageModal
        isOpen={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        onCreate={handleCreatePage}
      />
    </div>
  );
};

export default WelcomeScreen;
