import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminMatchDashboard() {
   const [matches, setMatches] = useState([]);
   const [selectedMatch, setSelectedMatch] = useState(null);
   const [editForm, setEditForm] = useState({});

   // Fetch all matches
   useEffect(() => {
      axios.get("/api/v1/matches/").then((res) => setMatches(res.data.data));
   }, []);

   const handleSelectMatch = async (id) => {
      try {
         const res = await axios.get(`/api/v1/matches/${id}`);
         setSelectedMatch(res.data.data);
         setEditForm(res.data.data);
      } catch (error) {
         console.error(error);
         alert("Failed to fetch match");
      }
   };

   const handleStatusChange = async (status) => {
      try {
         const res = await axios.patch(
            `/api/v1/matches/status/${selectedMatch._id}`,
            {
               status,
            }
         );
         alert("Status updated successfully");
         setSelectedMatch(res.data.data);
      } catch {
         alert("Status update failed");
      }
   };

   const handleUpdateMatch = async () => {
      try {
         const res = await axios.put(
            `/api/v1/matches/update/${selectedMatch._id}`,
            editForm
         );
         alert("Match updated successfully");
         setSelectedMatch(res.data.data);
      } catch  {
         alert("Match update failed");
      }
   };

   const handleDeleteMatch = async (id) => {
      if (!window.confirm("Are you sure you want to delete this match?"))
         return;
      try {
         await axios.delete(`/api/v1/matches/delete/${id}`);
         setMatches((prev) => prev.filter((m) => m._id !== id));
         if (selectedMatch && selectedMatch._id === id) {
            setSelectedMatch(null);
         }
         alert("Match deleted");
      } catch  {
         alert("Failed to delete match");
      }
   };

   return (
      <div className="p-4">
         <h2 className="text-2xl font-bold mb-4">Admin Match Dashboard</h2>

         <div className="grid md:grid-cols-2 gap-4">
            {matches.map((match) => (
               <div key={match._id} className="border rounded p-4 shadow-sm">
                  <h3 className="font-semibold">{match.gameId?.name}</h3>
                  <p>Start: {new Date(match.startTime).toLocaleString()}</p>
                  <p>Status: {match.status}</p>
                  <button
                     className="btn-primary mt-2 mr-2"
                     onClick={() => handleSelectMatch(match._id)}
                  >
                     Edit
                  </button>
                  <button
                     className="btn-danger mt-2"
                     onClick={() => handleDeleteMatch(match._id)}
                  >
                     Delete
                  </button>
               </div>
            ))}
         </div>

         {selectedMatch && (
            <div className="mt-8 border rounded p-6 bg-gray-50 shadow-lg">
               <h3 className="text-xl font-bold mb-4">
                  Edit Match: {selectedMatch._id}
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                     label="Start Time"
                     type="datetime-local"
                     value={new Date(editForm.startTime)
                        .toISOString()
                        .slice(0, 16)}
                     onChange={(val) =>
                        setEditForm({ ...editForm, startTime: val })
                     }
                  />
                  <InputField
                     label="Entry Fee"
                     type="number"
                     value={editForm.entryFee}
                     onChange={(val) =>
                        setEditForm({ ...editForm, entryFee: val })
                     }
                  />
                  <InputField
                     label="Per Kill"
                     type="number"
                     value={editForm.perKill}
                     onChange={(val) =>
                        setEditForm({ ...editForm, perKill: val })
                     }
                  />
                  <InputField
                     label="Type"
                     value={editForm.type}
                     onChange={(val) => setEditForm({ ...editForm, type: val })}
                  />
                  <InputField
                     label="Map"
                     value={editForm.map}
                     onChange={(val) => setEditForm({ ...editForm, map: val })}
                  />
                  <InputField
                     label="Max Players"
                     type="number"
                     value={editForm.maxPlayers}
                     onChange={(val) =>
                        setEditForm({ ...editForm, maxPlayers: val })
                     }
                  />
                  <InputField
                     label="Level Criteria"
                     type="number"
                     value={editForm.levelCriteria}
                     onChange={(val) =>
                        setEditForm({ ...editForm, levelCriteria: val })
                     }
                  />
               </div>

               <div className="mt-4 flex gap-4">
                  <button className="btn-primary" onClick={handleUpdateMatch}>
                     Save Changes
                  </button>
                  <button
                     className="btn-secondary"
                     onClick={() => handleStatusChange("COMPLETE")}
                  >
                     Mark Complete
                  </button>
                  <button
                     className="btn-secondary"
                     onClick={() => handleStatusChange("ONGOING")}
                  >
                     Mark Ongoing
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

function InputField({ label, type = "text", value, onChange }) {
   return (
      <div className="flex flex-col">
         <label className="text-sm font-semibold">{label}</label>
         <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border px-3 py-2 rounded"
         />
      </div>
   );
}
