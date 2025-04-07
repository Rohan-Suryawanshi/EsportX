import { useState, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faImage,
   faUpload,
   faCheckCircle,
   faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../context/UserContext";

function UpdateAvatar() {
   const { setUser } = useContext(UserContext);
   const [avatar, setAvatar] = useState(null);
   const [preview, setPreview] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   const handleFileChange = (e) => {
      const file = e.target.files[0];
      setAvatar(file);
      if (file) {
         setPreview(URL.createObjectURL(file));
      }
      setError("");
      setSuccess("");
   };

   const handleUpload = async () => {
      if (!avatar) {
         setError("Please select an image to upload.");
         return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("avatar", avatar);
      const token = localStorage.getItem("accessToken");


      try {
         const response = await axios.put(
            "/api/v1/users/update-image",
            formData,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setUser(response.data.data);
         setSuccess("Avatar updated successfully!");
         setAvatar(null);
         setPreview(null);
      } catch {
         setError("Failed to update avatar.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl mx-auto mt-12 border border-gray-200">
         <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
               icon={faImage}
               className="text-2xl text-blue-600"
            />
            <h3 className="text-2xl font-bold text-gray-800">Update Avatar</h3>
         </div>

         {preview && (
            <div className="flex justify-center mb-6">
               <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow"
               />
            </div>
         )}

         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
               Select new avatar
            </label>
            <input
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               className="block w-full px-3 py-2 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
         </div>

         {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
         {success && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
               <FontAwesomeIcon icon={faCheckCircle} />
               {success}
            </p>
         )}

         <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60"
         >
            {loading ? (
               <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Uploading...
               </>
            ) : (
               <>
                  <FontAwesomeIcon icon={faUpload} />
                  Upload Avatar
               </>
            )}
         </button>
      </div>
   );
}

export default UpdateAvatar;
