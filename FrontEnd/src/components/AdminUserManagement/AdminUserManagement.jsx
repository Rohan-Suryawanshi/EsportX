import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

function AdminUserManagement() {
   const [users, setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get("/api/v1/users", {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            setUsers(res.data.data);
         } catch {
            setError("Failed to fetch users");
         } finally {
            setLoading(false);
         }
      };

      fetchUsers();
   }, []);

   const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      try {
         const token = localStorage.getItem("accessToken");
         await axios.delete(`/api/v1/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setUsers(users.filter((u) => u._id !== id));
      } catch {
         alert("Failed to delete user.");
      }
   };

   const handleView = async (id) => {
      try {
         const token = localStorage.getItem("accessToken");
         const res = await axios.get(`/api/v1/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setSelectedUser(res.data.data);
      } catch {
         alert("Failed to fetch user details.");
      }
   };

   if (loading) return <p className="text-center">Loading users...</p>;
   if (error) return <p className="text-center text-red-500">{error}</p>;

   return (
      <div className="p-6">
         <h2 className="text-2xl font-semibold mb-4">
            User Management (Admin)
         </h2>

         <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
               <thead className="bg-gray-200">
                  <tr>
                     <th className="px-4 py-2">Username</th>
                     <th className="px-4 py-2">Email</th>
                     <th className="px-4 py-2">Role</th>
                     <th className="px-4 py-2">Wallet</th>
                     <th className="px-4 py-2">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((u) => (
                     <tr key={u._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{u.username}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.role || "user"}</td>
                        <td className="px-4 py-2">
                           ₹{u.walletBalance?.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                           <button
                              onClick={() => handleView(u._id)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                           >
                              <FontAwesomeIcon icon={faEye} />
                           </button>
                           <button
                              onClick={() => handleDelete(u._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                           >
                              <FontAwesomeIcon icon={faTrash} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {selectedUser && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold mb-2">User Details</h3>
               <p>
                  <strong>ID:</strong> {selectedUser._id}
               </p>
               <p>
                  <strong>Username:</strong> {selectedUser.username}
               </p>
               <p>
                  <strong>Email:</strong> {selectedUser.email}
               </p>
               <p>
                  <strong>Role:</strong> {selectedUser.role}
               </p>
               <p>
                  <strong>Wallet:</strong> ₹
                  {selectedUser.walletBalance?.toFixed(2)}
               </p>
            </div>
         )}
      </div>
   );
}

export default AdminUserManagement;
