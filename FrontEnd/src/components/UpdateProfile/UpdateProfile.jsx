import { useState } from "react";
import axios from "axios";

function UpdateProfile({ user, setUser }) {
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.post("/api/user/updateProfile", profileData, {
        withCredentials: true,
      });
      setUser(response.data);
      setSuccess("Profile updated successfully");
      setError("");
    } catch (err) {
      setError("Failed to update profile");
      setSuccess("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mt-10">
      <h3 className="text-lg font-semibold text-gray-700">Update Profile</h3>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded mt-2"
        value={profileData.username}
        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded mt-2"
        value={profileData.email}
        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleProfileUpdate}
      >
        Save Changes
      </button>
    </div>
  );
}

export default UpdateProfile;
