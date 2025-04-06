import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

function GameMatchesPage() {
   const { gameId } = useParams();
   const navigate = useNavigate();
   const [matches, setMatches] = useState([]);
   const [loading, setLoading] = useState(true);

   const isLoggedIn = !!localStorage.getItem("refreshToken"); // Assuming JWT stored in localStorage

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
                  {matches.map((match, index) => {
                     const availableSeats =
                        match.maxPlayers - match.totalPlayersJoined;
                     const fillPercent = Math.min(
                        (match.totalPlayersJoined / match.maxPlayers) * 100,
                        100
                     ).toFixed(0);

                     return (
                        <div
                           key={index}
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
                              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
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
      </>
   );
}

export default GameMatchesPage;
