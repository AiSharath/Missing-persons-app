import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  
  return (
    <div style={{
      border: "2px solid white",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <nav
        style={{
          width: "100%",
          backgroundColor: "#1a1a1a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          fontSize: "17px",
          padding: "15px 20px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <Link 
          to="/" 
          style={{ 
            color: "white", 
            textDecoration: "none",
            display: "flex",
            alignItems: "center"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>🕵 Missing Person Finder</h2>
        </Link>

        <div style={{ 
          display: "flex", 
          gap: "15px", 
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <Link 
            to="/" 
            style={{ 
              color: location.pathname === "/" ? "#667eea" : "white", 
              textDecoration: "none",
              fontWeight: location.pathname === "/" ? "600" : "normal",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              backgroundColor: location.pathname === "/" ? "rgba(102, 126, 234, 0.2)" : "transparent"
            }}
          >
            🏠 Home
          </Link>
          <Link 
            to="/found-missing" 
            style={{ 
              color: location.pathname === "/found-missing" ? "#667eea" : "white", 
              textDecoration: "none",
              fontWeight: location.pathname === "/found-missing" ? "600" : "normal",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              backgroundColor: location.pathname === "/found-missing" ? "rgba(102, 126, 234, 0.2)" : "transparent"
            }}
          >
            📋 Found & Missing
          </Link>
          <Link 
            to="/report" 
            style={{ 
              color: location.pathname === "/report" ? "#667eea" : "white", 
              textDecoration: "none",
              fontWeight: location.pathname === "/report" ? "600" : "normal",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              backgroundColor: location.pathname === "/report" ? "rgba(102, 126, 234, 0.2)" : "transparent"
            }}
          >
            📝 Report Missing
          </Link>
          <Link 
            to="/face-match" 
            style={{ 
              color: location.pathname === "/face-match" ? "#667eea" : "white", 
              textDecoration: "none",
              fontWeight: location.pathname === "/face-match" ? "600" : "normal",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              backgroundColor: location.pathname === "/face-match" ? "rgba(102, 126, 234, 0.2)" : "transparent"
            }}
          >
            🔍 Search Face
          </Link>
          <Link 
            to="/register" 
            style={{ 
              color: location.pathname === "/register" ? "#667eea" : "white", 
              textDecoration: "none",
              fontWeight: location.pathname === "/register" ? "600" : "normal",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              backgroundColor: location.pathname === "/register" ? "rgba(102, 126, 234, 0.2)" : "transparent"
            }}
          >
            👤 Register
          </Link>
          <Link 
            to="/login" 
            style={{ 
              color: location.pathname === "/login" ? "#667eea" : "white", 
              textDecoration: "none",
              fontWeight: location.pathname === "/login" ? "600" : "normal",
              padding: "8px 12px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
              backgroundColor: location.pathname === "/login" ? "rgba(102, 126, 234, 0.2)" : "transparent"
            }}
          >
            🔐 Login
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
