import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faPlus,
   faTrash,
   faPen,
   faCheck,
   faClockRotateLeft,
   faXmark,
   faUsers,
   faSave,
} from "@fortawesome/free-solid-svg-icons";

export default function TournamentManagement() {
   const [matches, setMatches] = useState([]);
   const [games, setGames] = useState([]);
   const [selectedMatch, setSelectedMatch] = useState(null);
   const [showForm, setShowForm] = useState(false);
   const [showParticipants, setShowParticipants] = useState(false);
   const [participants, setParticipants] = useState([]);

   const [form, setForm] = useState({
      gameId: "",
      startTime: "",
      entryFee: "",
      perKill: "",
      type: "",
      map: "",
      maxPlayers: "",
      levelCriteria: "",
      roomId: "",
      roomPassword: "",
   });

   const token = localStorage.getItem("accessToken");
   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      const [matchRes, gameRes] = await Promise.all([
         axios.get("/api/v1/matches/all-matches", {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         }),
         axios.get("/api/v1/games/"),
      ]);
      setMatches(matchRes.data.data);
      setGames(gameRes.data.data);
   };

   const handleSubmit = async () => {
      try {
         if (selectedMatch) {
            await axios.put(
               `/api/v1/matches/update/${selectedMatch._id}`,
               form,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                     "Content-Type": "application/json",
                  },
               }
            );
            alert("Match updated!");
         } else {
            await axios.post("/api/v1/matches", form);
            alert("Match created!");
         }
         setShowForm(false);
         setForm({});
         setSelectedMatch(null);
         fetchData();
      } catch {
         alert("Error submitting form");
      }
   };

   const handleEdit = (match) => {
      setSelectedMatch(match);
      setForm({
         ...match,
         startTime: new Date(match.startTime).toISOString().slice(0, 16),
      });
      setShowForm(true);
   };

   const handleDelete = async (id) => {
      if (!window.confirm("Are you sure?")) return;
      await axios.delete(`/api/v1/matches/delete/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
      });
      fetchData();
   };

   const handleStatus = async (id, status) => {
      await axios.patch(
         `/api/v1/matches/status/${id}`,
         { status },
         {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         }
      );
      fetchData();
   };

   const handleViewParticipants = async (matchId) => {
      const res = await axios.get(
         `/api/v1/match-participants/match/${matchId}`,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         }
      );

      setParticipants(res.data.data);
      setSelectedMatch(matches.find((m) => m._id === matchId));
      setShowParticipants(true);
   };

   const handleKillUpdate = async (participantId, newKills) => {
      await axios.put(
         `/api/v1/match-participants/stats/${participantId}`,
         {
            kills: newKills,
         },
         {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         }
      );
      handleViewParticipants(selectedMatch._id);
   };

   const handleRemoveParticipant = async (id) => {
      if (!window.confirm("Remove this participant?")) return;
      await axios.delete(`/api/v1/match-participants/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
      });
      handleViewParticipants(selectedMatch._id);
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Match Dashboard</h2>
            <button
               onClick={() => {
                  setSelectedMatch(null);
                  setForm({});
                  setShowForm(true);
               }}
               className="btn-primary flex items-center gap-2"
            >
               <FontAwesomeIcon icon={faPlus} />
               Add Match
            </button>
         </div>

         {/* Match Table */}
         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm">
               <thead className="bg-gray-100 text-gray-700">
                  <tr>
                     <th className="px-4 py-2 text-left">Game</th>
                     <th className="px-4 py-2 text-left">Start Time</th>
                     <th className="px-4 py-2">Type</th>
                     <th className="px-4 py-2">Players</th>
                     <th className="px-4 py-2">Status</th>
                     <th className="px-4 py-2">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {matches.map((match) => (
                     <tr key={match._id} className="border-t">
                        <td className="px-4 py-2">{match.gameId?.name}</td>
                        <td className="px-4 py-2">
                           {new Date(match.startTime).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-center">{match.type}</td>
                        <td className="px-4 py-2 text-center">
                           {match.totalPlayersJoined}/{match.maxPlayers}
                        </td>
                        <td className="px-4 py-2 text-center">
                           {match.status}
                        </td>
                        <td className="px-4 py-2 flex gap-2 justify-center">
                           <button
                              title="View Participants"
                              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md"
                              onClick={() => handleViewParticipants(match._id)}
                           >
                              <FontAwesomeIcon icon={faUsers} />
                           </button>
                           <button
                              title="Edit"
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                              onClick={() => handleEdit(match)}
                           >
                              <FontAwesomeIcon icon={faPen} />
                           </button>
                           <button
                              title="Mark as Ongoing"
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
                              onClick={() => handleStatus(match._id, "ONGOING")}
                           >
                              <FontAwesomeIcon icon={faCheck} />
                           </button>
                           <button
                              title="Mark as Ongoing"
                              className="bg-amber-200 hover:bg-amber-100 text-white p-2 rounded-md"
                              onClick={() =>
                                 handleStatus(match._id, "COMPLETE")
                              }
                           >
                              <FontAwesomeIcon icon={faCheck} />
                           </button>
                           <button
                              title="Mark as Upcoming"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                              onClick={() =>
                                 handleStatus(match._id, "UPCOMING")
                              }
                           >
                              <FontAwesomeIcon icon={faClockRotateLeft} />
                           </button>
                           <button
                              title="Delete"
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                              onClick={() => handleDelete(match._id)}
                           >
                              <FontAwesomeIcon icon={faTrash} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Add/Edit Match Form */}
         {showForm && (
            <MatchForm
               form={form}
               setForm={setForm}
               games={games}
               onCancel={() => setShowForm(false)}
               onSubmit={handleSubmit}
               selectedMatch={selectedMatch}
            />
         )}

         {/* Participant Modal */}
         {showParticipants && (
            <div className="fixed inset-0 z-50 backdrop-blur-xs bg-opacity-40 flex justify-center items-center p-4">
               <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 overflow-auto max-h-[80vh]">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold">
                        Participants - {selectedMatch?.gameId?.name}
                     </h3>
                     <button onClick={() => setShowParticipants(false)}>
                        <FontAwesomeIcon icon={faXmark} size="lg" />
                     </button>
                  </div>
                  <table className="min-w-full text-sm border">
                     <thead className="bg-gray-100">
                        <tr>
                           <th className="p-2 text-left">Name</th>
                           <th className="p-2 text-left">Game UserId</th>
                           <th className="p-2 text-left">Game Username</th>
                           <th className="p-2 text-center">Kills</th>
                           <th className="p-2 text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {participants.map((p) => (
                           <tr key={p._id} className="border-t">
                              <td className="p-2">{p.userId?.username}</td>
                              <td className="p-2">{p.gameUID}</td>
                              <td className="p-2">{p.gameUsername}</td>
                              <td className="p-2 text-center">
                                 <input
                                    type="number"
                                    defaultValue={p.kills}
                                    onBlur={(e) =>
                                       handleKillUpdate(p._id, e.target.value)
                                    }
                                    className="border p-1 w-16 text-center rounded"
                                 />
                              </td>
                              <td className="p-2 text-center">
                                 <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() =>
                                       handleRemoveParticipant(p._id)
                                    }
                                 >
                                    <FontAwesomeIcon icon={faTrash} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   );
}

// Reusable Form Component
function MatchForm({
   form,
   setForm,
   games,
   onCancel,
   onSubmit,
   selectedMatch,
}) {
   return (
      <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow">
         <h3 className="text-xl font-semibold mb-4">
            {selectedMatch ? "Edit Match" : "Add New Match"}
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
               label="Game"
               type="select"
               value={form.gameId}
               onChange={(val) => setForm({ ...form, gameId: val })}
               options={games.map((g) => ({
                  label: g.name,
                  value: g._id,
               }))}
            />
            <InputField
               label="Start Time"
               type="datetime-local"
               value={form.startTime}
               onChange={(val) => setForm({ ...form, startTime: val })}
            />
            <InputField
               label="Entry Fee"
               type="number"
               value={form.entryFee}
               onChange={(val) => setForm({ ...form, entryFee: val })}
            />
            <InputField
               label="Per Kill"
               type="number"
               value={form.perKill}
               onChange={(val) => setForm({ ...form, perKill: val })}
            />
            <InputField
               label="Type"
               type="select"
               value={form.type}
               onChange={(val) => setForm({ ...form, type: val })}
               options={[
                  { label: "Solo", value: "Solo" },
                  { label: "Duo", value: "Duo" },
                  { label: "Squad", value: "Squad" },
               ]}
            />
            <InputField
               label="Map"
               value={form.map}
               onChange={(val) => setForm({ ...form, map: val })}
            />
            <InputField
               label="Max Players"
               type="number"
               value={form.maxPlayers}
               onChange={(val) => setForm({ ...form, maxPlayers: val })}
            />
            <InputField
               label="Level Criteria"
               type="number"
               value={form.levelCriteria}
               onChange={(val) => setForm({ ...form, levelCriteria: val })}
            />
            <InputField
               label="Room Id"
               type="text"
               value={form.RoomId}
               onChange={(val) => setForm({ ...form, roomId: val })}
            />
            <InputField
               label="Room Password"
               type="text"
               value={form.RoomPassword}
               onChange={(val) => setForm({ ...form,roomPassword: val })}
            />
         </div>
         <div className="mt-4 flex gap-4">
            <button className="btn-primary" onClick={onSubmit}>
               <FontAwesomeIcon icon={faSave} className="mr-1" />
               {selectedMatch ? "Update" : "Create"} Match
            </button>
            <button className="btn-danger" onClick={onCancel}>
               <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
         </div>
      </div>
   );
}

function InputField({ label, type = "text", value, onChange, options }) {
   return (
      <div className="flex flex-col">
         <label className="text-sm font-semibold mb-1">{label}</label>
         {type === "select" ? (
            <select
               value={value}
               onChange={(e) => onChange(e.target.value)}
               className="border px-3 py-2 rounded"
            >
               <option value="">Select {label}</option>
               {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                     {opt.label}
                  </option>
               ))}
            </select>
         ) : (
            <input
               type={type}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               className="border px-3 py-2 rounded"
            />
         )}
      </div>
   );
}
