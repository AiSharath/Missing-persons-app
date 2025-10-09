import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import Register from "./Register.jsx"
import Login from "./Login.jsx";


function App() {
  return (
    <>  
    <Router>
        <Routes>
          <Route path="/registerMissing" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
    </Router>    
    </>
  );
}

export default App;
