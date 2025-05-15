import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faPlus,
   faTimes,
   faPen,
   faTrash,
} from "@fortawesome/free-solid-svg-icons";

function AdminGamePage() {
   const [games, setGames] = useState([]);
   const [formMode, setFormMode] = useState("create"); // or "edit"
   const [formData, setFormData] = useState({
      name: "",
      status: "Active",
      image: null,
   });
   const [selectedGameId, setSelectedGameId] = useState(null);
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");
   const [showModal, setShowModal] = useState(false);

   const fetchGames = async () => {
      try {
         const token = localStorage.getItem("accessToken");
         const res = await axios.get("https://esport-x.vercel.app/api/v1/games", {
            headers: { Authorization: `Bearer ${token}` },
         });
         setGames(res.data.data);
      } catch {
         setError("Failed to fetch games.");
      }
   };

   useEffect(() => {
      fetchGames();
   }, []);

   const resetForm = () => {
      setFormData({ name: "", status: "Active", image: null });
      setFormMode("create");
      setSelectedGameId(null);
      setShowModal(false);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("accessToken");
      const form = new FormData();
      form.append("name", formData.name);
      form.append("status", formData.status);
      if (formData.image) form.append("image", formData.image);

      try {
         if (formMode === "create") {
            await axios.post("https://esport-x.vercel.app/api/v1/games", form, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            });
            setMessage("Game created successfully!");
         } else {
            await axios.put(`https://esport-x.vercel.app/api/v1/games/${selectedGameId}`, form, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            });
            setMessage("Game updated successfully!");
         }
         resetForm();
         fetchGames();
      } catch (err) {
         setError(err.response?.data?.message || "Action failed.");
      }
   };

   const handleDelete = async (id) => {
      if (!window.confirm("Delete this game?")) return;
      const token = localStorage.getItem("accessToken");
      try {
         await axios.delete(`https://esport-x.vercel.app/api/v1/games/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setGames(games.filter((g) => g._id !== id));
      } catch {
         alert("Failed to delete game.");
      }
   };

   const handleEdit = (game) => {
      setFormMode("edit");
      setSelectedGameId(game._id);
      setFormData({ name: game.name, status: game.status, image: null });
      setShowModal(true);
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Admin Game Management</h1>
            <button
               onClick={() => setShowModal(true)}
               className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
               <FontAwesomeIcon icon={faPlus} className="mr-2" />
               Add Game
            </button>
         </div>

         {message && <p className="text-green-600">{message}</p>}
         {error && <p className="text-red-600">{error}</p>}

         {/* Games Table */}
         <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
               <thead className="bg-gray-200">
                  <tr>
                     <th className="px-4 py-2">Image</th>
                     <th className="px-4 py-2">Name</th>
                     <th className="px-4 py-2">Status</th>
                     <th className="px-4 py-2">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {games.map((g) => (
                     <tr key={g._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                           <img
                              src={g.image}
                              alt={g.name}
                              className="h-12 w-12 object-cover rounded"
                           />
                        </td>
                        <td className="px-4 py-2 font-medium">{g.name}</td>
                        <td className="px-4 py-2">{g.status}</td>
                        <td className="px-4 py-2 space-x-2">
                           <button
                              onClick={() => handleEdit(g)}
                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                           >
                              <FontAwesomeIcon icon={faPen} className="mr-1" />
                              Edit
                           </button>
                           <button
                              onClick={() => handleDelete(g._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                           >
                              <FontAwesomeIcon
                                 icon={faTrash}
                                 className="mr-1"
                              />
                              Delete
                           </button>
                        </td>
                     </tr>
                  ))}
                  {games.length === 0 && (
                     <tr>
                        <td
                           colSpan="4"
                           className="text-center py-4 text-gray-500"
                        >
                           No games found.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Modal */}
         {showModal && (
            <div className="fixed inset-0 backdrop-blur-3xl bg-opacity-40 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                  <button
                     onClick={() => setShowModal(false)}
                     className="absolute top-2 right-2 text-gray-600 hover:text-black"
                  >
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <h2 className="text-xl font-semibold mb-4">
                     {formMode === "create" ? "Create Game" : "Update Game"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Game Name"
                        value={formData.name}
                        onChange={(e) =>
                           setFormData({ ...formData, name: e.target.value })
                        }
                        required
                     />
                     <select
                        className="w-full border rounded px-3 py-2"
                        value={formData.status}
                        onChange={(e) =>
                           setFormData({ ...formData, status: e.target.value })
                        }
                     >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                     </select>
                     <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              image: e.target.files[0],
                           })
                        }
                     />
                     <div className="space-x-2">
                        <button
                           type="submit"
                           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                           {formMode === "create"
                              ? "Create Game"
                              : "Update Game"}
                        </button>
                        <button
                           type="button"
                           onClick={resetForm}
                           className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100"
                        >
                           Cancel
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}

export default AdminGamePage;
