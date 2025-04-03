import { useState } from "react";
import axios from "axios";

function UpdatePassword() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordUpdate = async () => {
    setMessage("");
    setError("");
    try {
      await axios.post("/api/user/updatePassword", passwordData, {
        withCredentials: true,
      });
      setMessage("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update password. Please try again."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mt-10">
      <h3 className="text-lg font-semibold text-gray-700">Update Password</h3>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-2 border rounded mt-2"
        value={passwordData.currentPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, currentPassword: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded mt-2"
        value={passwordData.newPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, newPassword: e.target.value })
        }
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        onClick={handlePasswordUpdate}
      >
        Change Password
      </button>
    </div>
  );
}

export default UpdatePassword;
