import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Seo from "../components/Seo";

function LeaderboardPage() {
   const [games, setGames] = useState([]);
   const [selectedGameId, setSelectedGameId] = useState("");
   const [leaderboard, setLeaderboard] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   // Fetch all games on mount
   useEffect(() => {
      const fetchGames = async () => {
         try {
            const res = await axios.get("https://esport-x.vercel.app/api/v1/games", {
               withCredentials: true,
            });
            setGames(res.data.data);
         } catch {
            setError("Failed to load games.");
         }
      };
      fetchGames();
   }, []);

   // Fetch leaderboard when a game is selected
   useEffect(() => {
      if (!selectedGameId) return;

      const fetchLeaderboard = async () => {
         setLoading(true);
         setError("");
         try {
            const res = await axios.get("https://esport-x.vercel.app/api/v1/leaderboard", {
               params: { gameId: selectedGameId },
               withCredentials: true,
            });
            setLeaderboard(res.data.data);
         } catch (err) {
            setError(
               err.response?.data?.message || "Error fetching leaderboard"
            );
         } finally {
            setLoading(false);
         }
      };

      fetchLeaderboard();
   }, [selectedGameId]);

   return (
      <>
         <Seo title="Leaderboard" description="View top players and rankings across games on Esport-X." url="/leaderboard" />
         <Navbar />
         <div className="min-h-screen  py-10 px-4">
            <div className="max-w-4xl mx-auto">
               <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                  Game Leaderboard
               </h1>

               <div className="mb-6 text-center">
                  <label className="text-lg font-medium mr-2">
                     Select Game:
                  </label>
                  <select
                     value={selectedGameId}
                     onChange={(e) => setSelectedGameId(e.target.value)}
                     className="p-2 border rounded-md"
                  >
                     <option value="">-- Select --</option>
                     {games.map((game) => (
                        <option key={game._id} value={game._id}>
                           {game.name}
                        </option>
                     ))}
                  </select>
               </div>

               {loading ? (
                  <p className="text-center text-gray-500">
                     Loading leaderboard...
                  </p>
               ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
               ) : leaderboard.length === 0 && selectedGameId ? (
                  <p className="text-center text-gray-500">
                     No leaderboard data.
                  </p>
               ) : leaderboard.length > 0 ? (
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                 Rank
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                 Player
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                 Kills
                              </th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {leaderboard.map((entry, index) => (
                              <tr key={entry._id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                    {index + 1}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                    <img
                                       src={entry.userId.avatar}
                                       alt="avatar"
                                       className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-900">
                                       {entry.userId.username}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-center text-sm text-gray-700">
                                    {entry.totalKills}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : null}
            </div>
         </div>
      </>
   );

}

export default LeaderboardPage;
