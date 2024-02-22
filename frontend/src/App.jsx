import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from "./pages/Sendmoney"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import {BrowserRouter,Navigate,Route,Routes, useLocation, useNavigate} from "react-router-dom";
import { useEffect } from "react";



function App() {  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      console.log("Navigating to dashboard...");
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);
  
  return (
    <>
    <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
    </Routes>
     
    </>
  )
}

export default App
