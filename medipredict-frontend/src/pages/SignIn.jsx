import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignIn({ setIsAuth, isAuth }) {
  const [isSignUp, setIsSignUp] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate("/dashboard");
  }, [isAuth, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    if (isSignUp) {
      const userExists = users.find(u => u.email === email);
      if (userExists) {
        alert("Account already exists! Please Sign In.");
      } else {
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        alert("Account Created Successfully! You can now Sign In.");
        setIsSignUp(false);
      }
    } else {
      const validUser = users.find(u => u.email === email && u.password === password);
      
      const isDefault = email === "user@medipredict.com" && password === "user123";

      if (validUser || isDefault) {
        localStorage.setItem("doctorAuth", "true");
        localStorage.setItem("userName", email.split('@')[0]); // Use email prefix as Name
        setIsAuth(true);
        navigate("/dashboard");
      } else {
        alert("FAILED: Invalid Credentials. If you don't have an account, Sign Up!");
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] p-8 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSignUp ? "Create Account" : "User Login"}
          </h2>
          <p className="text-gray-400 mt-1 text-xs uppercase tracking-widest">
            {isSignUp ? "Join the health portal" : "Access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            required
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-3 text-white focus:border-emerald-500 outline-none"
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-3 text-white focus:border-emerald-500 outline-none"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-md transition-all">
            {isSignUp ? "Register" : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"} 
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="ml-2 text-emerald-500 hover:underline font-bold"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}