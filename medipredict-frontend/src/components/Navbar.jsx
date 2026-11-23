import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("doctorAuth");
    if (!auth && isAuth) {
      setIsAuth(false); 
    } else if (auth && !isAuth) {
      setIsAuth(true); 
    }
  }, [location, isAuth, setIsAuth]);

  const handleLogout = () => {
    localStorage.removeItem("doctorAuth");
        setIsAuth(false);
    
    navigate("/", { replace: true });
  };

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-white font-bold text-xl tracking-tighter">
        MEDI<span className="text-emerald-500">PREDICT</span>
      </Link>

      <div className="flex gap-8 items-center">
        <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link>

        {isAuth ? (
          <>
            <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link to="/xai" className="text-gray-400 hover:text-white text-sm transition-colors">XAI Report</Link>
            <Link to="/profile" className="text-gray-400 hover:text-white text-sm transition-colors">Profile & Reports</Link>

            <button 
              onClick={handleLogout} 
              className="text-red-500 text-xs font-bold border border-red-500/20 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-widest"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/signin" className="btn-emerald py-2 px-6 text-sm">Sign In</Link>
        )}
      </div>
    </nav>
  );
}