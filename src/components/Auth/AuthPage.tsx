import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { useAuthStore } from "../../store/authStore";
import "../../styles/Auth.css";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  // Check if the URL contains a signup parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "true") {
      setShowLogin(false);
    }
  }, []);

  // Direct navigation when user state changes
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const toggleAuthMode = () => {
    setShowLogin(!showLogin);
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-container">
            <h2>Checking authentication...</h2>
            <div className="auth-info">
              Please wait while we verify your authentication status...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {showLogin ? (
          <Login onSwitch={toggleAuthMode} />
        ) : (
          <Register onSwitch={toggleAuthMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
