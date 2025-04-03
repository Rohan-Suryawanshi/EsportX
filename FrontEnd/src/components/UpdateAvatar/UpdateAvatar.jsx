import { useState } from "react";
import axios from "axios";

function UpdateAvatar({ user, setUser }) {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!avatar) {
      setError("Please select an image to upload");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("avatar", avatar);
    
    try {
      const response = await axios.post("/api/user/updateAvatar", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data);
      alert("Avatar updated successfully");
    } catch (err) {
      setError("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mt-10">
      <h3 className="text-lg font-semibold text-gray-700">Update Avatar</h3>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="file"
        accept="image/*"
        className="w-full p-2 border rounded mt-2"
        onChange={handleFileChange}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
}

export default UpdateAvatar;
