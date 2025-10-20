import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Seo from "../components/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faUser,
   faEnvelope,
   faLock,
   faImage,
} from "@fortawesome/free-solid-svg-icons";

function RegisterPage() {
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      avatar: null,
   });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleFileChange = (e) => {
      setFormData({ ...formData, avatar: e.target.files[0] });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      if (
         !formData.username ||
         !formData.email ||
         !formData.password ||
         !formData.avatar
      ) {
         setError("All fields are required");
         setLoading(false);
         return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("avatar", formData.avatar);

      try {
         const response = await axios.post(
            "https://esport-x.vercel.app/api/v1/users/register",
            formDataToSend,
            {
               headers: { "Content-Type": "multipart/form-data" },
               withCredentials: true,
            }
         );
         if (response.data) {
            alert("Registration successful!");
            navigate("/login");
         }
      } catch (err) {
         setError(err.response?.data?.message || "Registration failed");
      } finally {
         setLoading(false);
      }
   };


   return (
      <>
            <Seo
               title="Register"
               description="Create an account on Esport-X to join matches, track stats and participate in tournaments."
               url="/register"
            />
         <Navbar />
         <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
               <h2 className="text-3xl font-extrabold text-center text-gray-800">
                  Create an Account
               </h2>
               <p className="text-gray-500 text-center mb-6">
                  Sign up to get started
               </p>
               {error && (
                  <p className="text-red-500 text-center mb-4">{error}</p>
               )}
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
                     <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-400 mr-2"
                     />
                     <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full bg-transparent outline-none"
                        value={formData.username}
                        onChange={handleChange}
                     />
                  </div>
                  <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
                     <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-gray-400 mr-2"
                     />
                     <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full bg-transparent outline-none"
                        value={formData.email}
                        onChange={handleChange}
                     />
                  </div>
                  <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
                     <FontAwesomeIcon
                        icon={faLock}
                        className="text-gray-400 mr-2"
                     />
                     <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full bg-transparent outline-none"
                        value={formData.password}
                        onChange={handleChange}
                        required
                     />
                  </div>
                  <label className="block text-gray-500 text-sm font-medium mb-1">
                     Upload Avatar
                  </label>
                  <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-50">
                     <FontAwesomeIcon
                        icon={faImage}
                        className="text-gray-400 mr-2"
                     />
                     <input
                        type="file"
                        name="avatar"
                        className="w-full bg-transparent outline-none"
                        onChange={handleFileChange}
                        placeholder="Upload Avatar"
                     />
                  </div>
                  <button
                     type="submit"
                     className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
                     disabled={loading}
                  >
                     {loading ? "Registering..." : "Register"}
                  </button>
               </form>
               <p className="text-center text-gray-500 text-sm mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                     Login
                  </a>
               </p>
            </div>
         </div>
      </>
   );
}

export default RegisterPage;
