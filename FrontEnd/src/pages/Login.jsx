import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useContext(UserContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("/api/v1/users/login", credentials, {
         withCredentials: true,
      });
      if (response.data) {
       const { user, accessToken, refreshToken } = response.data.data;

       // Store only what you need
       localStorage.setItem("accessToken", accessToken);
       localStorage.setItem("refreshToken", refreshToken);
       localStorage.setItem(
          "user",
          JSON.stringify({
             _id: user._id,
             username: user.username,
             email: user.email,
             role: user.role,
             avatar: user.avatar,
             walletBalance: user.walletBalance,
          })
       );
       localStorage.setItem("isLoggedIn", "true");
        setUser(user);
        setIsLoggedIn(true);
        navigate("/games");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-6">Login to access your account</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
              <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                className="w-full bg-transparent outline-none" 
                onChange={handleChange} 
              />
            </div>
            <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                className="w-full bg-transparent outline-none" 
                onChange={handleChange} 
              />
            </div>
            <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
              <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                className="w-full bg-transparent outline-none" 
                onChange={handleChange} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
