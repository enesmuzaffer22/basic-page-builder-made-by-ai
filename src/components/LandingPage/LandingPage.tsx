import { Link } from "react-router-dom";
import {
  FiLayers,
  FiCode,
  FiSmile,
  FiEdit,
  FiCpu,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import "../../styles/LandingPage.css";

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {" "}
      <section className="hero">
        {" "}
        <header className="landing-header">
          {" "}
          <div className="container">
            {" "}
            <div className="logo">
              Page Builder
            </div> {/* Desktop Navigation */}{" "}
            <nav className="nav desktop-nav">
              {" "}
              <a href="#features">Features</a>{" "}
              <a href="#how-it-works">How It Works</a>{" "}
              <Link to="/auth" className="nav-button">
                {" "}
                Sign In{" "}
              </Link>{" "}
            </nav>{" "}
            {/* Mobile Menu Button */}{" "}
            <button
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {" "}
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}{" "}
            </button>{" "}
            {/* Mobile Navigation */}{" "}
            <nav
              className={`mobile-nav ${
                isMobileMenuOpen ? "mobile-nav-open" : ""
              }`}
            >
              {" "}
              <a href="#features" onClick={closeMobileMenu}>
                Features
              </a>{" "}
              <a href="#how-it-works" onClick={closeMobileMenu}>
                How It Works
              </a>{" "}
              <Link to="/auth" className="nav-button" onClick={closeMobileMenu}>
                {" "}
                Sign In{" "}
              </Link>{" "}
            </nav>{" "}
          </div>{" "}
        </header>
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Build Beautiful Pages Without Code</h1>
            <p>
              A simple, intuitive page builder that lets you create stunning web
              pages using an easy drag-and-drop interface.
            </p>
            <div className="hero-buttons">
              <Link to="/auth?signup=true" className="primary-button">
                Get Started — It's Free
              </Link>
              <a href="#how-it-works" className="secondary-button">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="features">
        <div className="container">
          <h2>Why Choose Our Page Builder</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FiLayers className="feature-icon" />
              <h3>Intuitive Interface</h3>
              <p>
                Our drag-and-drop interface makes it easy to design pages
                exactly how you want them.
              </p>
            </div>
            <div className="feature-card">
              <FiCode className="feature-icon" />
              <h3>Clean Export</h3>
              <p>Export clean HTML and CSS code that you can use anywhere.</p>
            </div>
            <div className="feature-card">
              <FiSmile className="feature-icon" />
              <h3>Easy to Use</h3>
              <p>
                No coding knowledge required. Just drag, drop, and customize.
              </p>
            </div>
            <div className="feature-card">
              <FiEdit className="feature-icon" />
              <h3>Fully Customizable</h3>
              <p>
                Edit every aspect of your design with our comprehensive style
                editor.
              </p>
            </div>
            <div className="feature-card">
              <FiCpu className="feature-icon" />
              <h3>Optimized Code</h3>
              <p>
                Get clean, optimized code that loads fast and works everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your free account to get started with Page Builder.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Build Your Page</h3>
              <p>Use our intuitive editor to create your page layout.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Style Your Elements</h3>
              <p>
                Customize colors, fonts, spacing, and more with the style
                editor.
              </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Export Your Code</h3>
              <p>Download the HTML and CSS for your page.</p>
            </div>
          </div>
          <div className="cta-center">
            <Link to="/auth" className="primary-button">
              Start Building Now
            </Link>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">Page Builder</div>
            <p>Build beautiful pages without writing code.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
