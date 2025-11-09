import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import { Component } from "react";
import Register from "./Register.jsx"
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import RegisterUser from "./registerUser.jsx";
import FoundMissing from "./pages/FoundMissing";
import FaceMatch from "./pages/FaceMatch";

// Error Boundary to catch errors and prevent app from crashing
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "20px", 
          textAlign: "center",
          fontFamily: "Arial, sans-serif"
        }}>
          <h2>⚠️ Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "10px"
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: "20px", textAlign: "left" }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{ 
                background: "#f5f5f5", 
                padding: "10px", 
                overflow: "auto",
                fontSize: "12px"
              }}>
                {this.state.error?.toString()}
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<RegisterUser/>}/>
            <Route path="/report" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/found-missing" element={<FoundMissing />} />
            <Route path="/face-match" element={<FaceMatch />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
