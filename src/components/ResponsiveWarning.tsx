import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface ResponsiveWarningProps {
  children: React.ReactNode;
}

const ResponsiveWarning: React.FC<ResponsiveWarningProps> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  if (windowWidth < 1200) {
    return (
      <div className="responsive-warning">
        <div className="warning-content">
          <div className="warning-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="3"
                width="20"
                height="14"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="8"
                y1="21"
                x2="16"
                y2="21"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="17"
                x2="12"
                y2="21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h2>Uygulamayı Bilgisayarda Kullanmanız Önerilir</h2>
          <p>
            Bu uygulama masaüstü deneyimi için optimize edilmiştir. En iyi
            deneyim için lütfen uygulamayı 1200px veya daha geniş ekranlı bir
            cihazda kullanın.
          </p>
          <button className="home-button" onClick={handleGoHome}>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ResponsiveWarning;
