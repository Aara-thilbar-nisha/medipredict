import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import XAIReport from "./pages/XAIReport";
import SignIn from "./pages/SignIn";
import Profile from "./pages/profile";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const auth = localStorage.getItem("doctorAuth");
    if (auth === "true") {
      setIsAuth(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
        
        <Routes>
          <Route path="/" element={<Home isAuth={isAuth} />} />
          <Route path="/signin" element={<SignIn setIsAuth={setIsAuth} />} />
          <Route path="/dashboard" element={<Dashboard isAuth={isAuth} />} />
          <Route path="/xai" element={<XAIReport isAuth={isAuth} />} />
          <Route path="/profile" element={<Profile isAuth={isAuth} />} />
        </Routes>
      </div>
    </Router>
  );
}
const ProtectedRoute=({isAuth,children})=>{
   const auth = localStorage.getItem("doctorAuth");
  if (!auth && !isAuth) {
    return <Navigate to="/signin" replace />;
  }
    return children;
};