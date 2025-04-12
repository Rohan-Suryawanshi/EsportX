import React, { useEffect, useState } from "react";
import axios from "axios";

const MatchParticipantsModal = ({ matchId, onClose }) => {
   const [participants, setParticipants] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchParticipants = async () => {
      try {
         const res = await axios.get(`/api/matchparticipants/match/${matchId}`);
         setParticipants(res.data.data);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const updateKills = async (id, kills) => {
      try {
         await axios.put(`/api/matchparticipants/${id}/stats`, { kills });
         fetchParticipants(); // Refresh
      } catch (err) {
         console.error(err);
      }
   };

   const removeParticipant = async (id) => {
      if (!window.confirm("Are you sure you want to remove this participant?"))
         return;
      try {
         await axios.delete(`/api/matchparticipants/${id}`);
         fetchParticipants();
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      fetchParticipants();
   }, [matchId]);

   return (
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
         <div className="bg-white p-6 rounded-md w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Match Participants</h2>
            <button onClick={onClose} className="text-red-500 float-right">
               Close ✖
            </button>
            {loading ? (
               <p>Loading...</p>
            ) : (
               <table className="w-full text-left border mt-4">
                  <thead>
                     <tr className="bg-gray-100">
                        <th className="p-2">Username</th>
                        <th className="p-2">UID</th>
                        <th className="p-2">Kills</th>
                        <th className="p-2">Earnings</th>
                        <th className="p-2">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {participants.map((p) => (
                        <tr key={p._id} className="border-b">
                           <td className="p-2">{p.gameUsername}</td>
                           <td className="p-2">{p.gameUID}</td>
                           <td className="p-2">
                              <input
                                 type="number"
                                 defaultValue={p.kills || 0}
                                 className="border rounded px-2 py-1 w-16"
                                 onBlur={(e) =>
                                    updateKills(p._id, parseInt(e.target.value))
                                 }
                              />
                           </td>
                           <td className="p-2">
                              ₹{(p.kills || 0) * p.matchId.perKill}
                           </td>
                           <td className="p-2">
                              <button
                                 onClick={() => removeParticipant(p._id)}
                                 className="bg-red-500 text-white px-2 py-1 rounded"
                              >
                                 Remove
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   );
};

export default MatchParticipantsModal;
