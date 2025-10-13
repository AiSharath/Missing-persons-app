import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import Register from "./Register.jsx"
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import RegisterUser from "./registerUser.jsx";

function App() {
  return (
    <>  
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<RegisterUser/>}/>
          <Route path="/report" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
    </Router>    
    </>
  );
}

export default App;
