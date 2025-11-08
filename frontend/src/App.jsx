import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import Register from "./Register.jsx"
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import RegisterUser from "./registerUser.jsx";
import FoundMissing from "./pages/FoundMissing";
import FaceMatch from "./pages/FaceMatch";

function App() {
  return (
    <>  
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
    </>
  );
}

export default App;
