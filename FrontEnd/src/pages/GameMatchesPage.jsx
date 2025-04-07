import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

function GameMatchesPage() {
   const { gameId } = useParams();
   const navigate = useNavigate();
   const [matches, setMatches] = useState([]);
   const [loading, setLoading] = useState(true);

   const isLoggedIn = !!localStorage.getItem("refreshToken");

   // Modal state
   const [showModal, setShowModal] = useState(false);
   const [selectedMatch, setSelectedMatch] = useState(null);
   const [gameUsername, setGameUsername] = useState("");
   const [gameUID, setGameUID] = useState("");
   const [formError, setFormError] = useState("");
   const [successMessage, setSuccessMessage] = useState("");

   useEffect(() => {
      const fetchMatches = async () => {
         try {
            const response = await axios.get(`/api/v1/matches/games/${gameId}`);
            if (response.data.success) {
               setMatches(response.data.data);
            }
         } catch (error) {
            console.error("Error fetching matches:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchMatches();
   }, [gameId]);

   const handleLoginRedirect = () => {
      navigate("/login");
   };

   const openModal = (match) => {
      setSelectedMatch(match);
      setGameUsername("");
      setGameUID("");
      setFormError("");
      setSuccessMessage("");
      setShowModal(true);
   };

   const handleRegister = async () => {
      if (!gameUsername || !gameUID) {
         setFormError("Please fill in all fields.");
         return;
      }

      try {
         const response = await axios.post(
            "/api/v1/match-participants/register",
            {
               matchId: selectedMatch._id,
               gameUsername,
               gameUID,
            }
         );

         if (response.data.success) {
            setSuccessMessage("Registered successfully!");
            setTimeout(() => {
               setShowModal(false);
            }, 1500);
         }
      } catch (error) {
         setFormError(
            error?.response?.data?.message || "Registration failed. Try again."
         );
      }
   };

   return (
      <>
         <Navbar />
         <div className="p-6 md:p-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
               Available <span className="text-orange-500">Matches</span>
            </h1>

            {loading ? (
               <p className="text-center text-lg text-gray-500">
                  Loading matches...
               </p>
            ) : matches.length === 0 ? (
               <div className="text-center text-gray-600 text-xl mt-20">
                  <p>No matches available for this game right now.</p>
                  <p className="text-sm text-gray-400 mt-2">
                     Please check back later or try another game.
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {matches.map((match) => {
                     const availableSeats =
                        match.maxPlayers - match.totalPlayersJoined;
                     const fillPercent = Math.min(
                        (match.totalPlayersJoined / match.maxPlayers) * 100,
                        100
                     ).toFixed(0);

                     return (
                        <div
                           key={match._id}
                           className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
                        >
                           <div className="mb-4">
                              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                 {match.type} Match
                              </h2>
                              <p className="text-sm text-gray-500">
                                 {match.map}
                              </p>
                           </div>

                           <div className="text-sm text-gray-700 space-y-1 mb-4">
                              <p>
                                 <strong>Start:</strong>{" "}
                                 {new Date(match.startTime).toLocaleString()}
                              </p>
                              <p>
                                 <strong>Entry Fee:</strong> ₹{match.entryFee}
                              </p>
                              <p>
                                 <strong>Per Kill Reward:</strong> ₹
                                 {match.perKill}
                              </p>
                              <p>
                                 <strong>Level Criteria:</strong>{" "}
                                 {match.levelCriteria}+
                              </p>
                           </div>

                           <div className="mb-3">
                              <p className="text-sm text-gray-600">
                                 <strong>Players Joined:</strong>{" "}
                                 {match.totalPlayersJoined}/{match.maxPlayers}
                              </p>
                              <p className="text-sm text-gray-600">
                                 <strong>Available Seats:</strong>{" "}
                                 {availableSeats}
                              </p>
                              <div className="w-full bg-gray-200 h-2 rounded mt-1">
                                 <div
                                    className="h-2 bg-green-500 rounded"
                                    style={{ width: `${fillPercent}%` }}
                                 ></div>
                              </div>
                           </div>

                           {isLoggedIn ? (
                              <button
                                 onClick={() => openModal(match)}
                                 className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                              >
                                 Join Match
                              </button>
                           ) : (
                              <button
                                 className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
                                 onClick={handleLoginRedirect}
                              >
                                 Login to Join
                              </button>
                           )}
                        </div>
                     );
                  })}
               </div>
            )}
         </div>

         {/* Join Match Modal */}
         {showModal && (
            <div className="fixed inset-0 z-50 backdrop-blur-3xl flex items-center justify-center bg-opacity-50">
               <div className="bg-white p-6 rounded-xl w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Join Match</h2>

                  <input
                     type="text"
                     placeholder="Game Username"
                     value={gameUsername}
                     onChange={(e) => setGameUsername(e.target.value)}
                     className="w-full mb-3 p-2 border border-gray-300 rounded"
                  />
                  <input
                     type="text"
                     placeholder="Game UID"
                     value={gameUID}
                     onChange={(e) => setGameUID(e.target.value)}
                     className="w-full mb-3 p-2 border border-gray-300 rounded"
                  />

                  {formError && (
                     <p className="text-red-500 text-sm mb-2">{formError}</p>
                  )}
                  {successMessage && (
                     <p className="text-green-600 text-sm mb-2">
                        {successMessage}
                     </p>
                  )}

                  <div className="flex justify-end gap-2">
                     <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setShowModal(false)}
                     >
                        Cancel
                     </button>
                     <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleRegister}
                     >
                        Register
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default GameMatchesPage;
