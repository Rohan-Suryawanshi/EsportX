import { useEffect, useState } from "react";
import axios from "axios";
import {
   faCalendarDays,
   faMapLocationDot,
   faUser,
   faUsers,
   faCoins,
   faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MyMatches() {
   const [activeTab, setActiveTab] = useState("ongoing");
   const [matches, setMatches] = useState({
      ongoing: [],
      upcoming: [],
      results: [],
   });
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchMatches = async () => {
         try {
            const [ongoingRes, upcomingRes, resultsRes] = await Promise.all([
               axios.get("/api/v1/matches?status=ONGOING"),
               axios.get("/api/v1/matches?status=UPCOMING"),
               axios.get("/api/v1/matches?status=COMPLETE"),
            ]);

            setMatches({
               ongoing: ongoingRes.data.data || [],
               upcoming: upcomingRes.data.data || [],
               results: resultsRes.data.data || [],
            });
         } catch (error) {
            console.error("Error fetching matches:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchMatches();
   }, []);

   const renderMatches = (matchList) => {
      if (loading)
         return (
            <p className="text-center text-gray-600 py-4 animate-pulse">
               Loading matches...
            </p>
         );
      if (!matchList.length)
         return (
            <p className="text-center text-gray-400 py-4">No matches found.</p>
         );

      return matchList.map((match) => {
         const incomeEstimate = match.perKill * 3; // Example for 3 kills

         return (
            <div
               key={match._id}
               className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 mb-5"
            >
               <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                     {match.gameId?.name || "Match"}
                  </h3>
                  <span
                     className={`px-3 py-1 rounded-full text-xs font-bold ${
                        match.status === "ONGOING"
                           ? "bg-yellow-100 text-yellow-600"
                           : match.status === "UPCOMING"
                           ? "bg-blue-100 text-blue-600"
                           : "bg-green-100 text-green-600"
                     }`}
                  >
                     {match.status}
                  </span>
               </div>

               <div className="grid grid-cols-2 gap-3 text-gray-600 text-sm">
                  <p className="flex items-center gap-2">
                     <FontAwesomeIcon icon={faCalendarDays} />{" "}
                     {new Date(match.startTime).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2">
                     <FontAwesomeIcon icon={faMapLocationDot} /> {match.map}
                  </p>
                  <p className="flex items-center gap-2">
                     <FontAwesomeIcon icon={faUser} /> Type: {match.type}
                  </p>
                  <p className="flex items-center gap-2">
                     <FontAwesomeIcon icon={faUsers} />{" "}
                     {match.totalPlayersJoined}/{match.maxPlayers} Joined
                  </p>
                  <p className="flex items-center gap-2">
                     <FontAwesomeIcon icon={faCoins} /> Entry Fee: ₹
                     {match.entryFee}
                  </p>
                  <p className="flex items-center gap-2">
                     <FontAwesomeIcon icon={faTrophy} /> Per Kill: ₹
                     {match.perKill}
                  </p>
               </div>

               <div className="mt-4 p-3 bg-gray-100 rounded-lg text-gray-700 text-sm">
                  <p>
                     <strong>Estimated Income:</strong> ₹{incomeEstimate}{" "}
                     <span className="text-xs text-gray-500">
                        (for 3 kills)
                     </span>
                  </p>
               </div>
            </div>
         );
      });
   };

   const tabs = ["ongoing", "upcoming", "results"];

   return (
      <div className="max-w-3xl mx-auto mt-10 px-6">
         <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-around border-b mb-6">
               {tabs.map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`py-2 px-4 text-lg font-semibold transition-all duration-200 ${
                        activeTab === tab
                           ? "border-b-2 border-blue-500 text-blue-600"
                           : "text-gray-500 hover:text-blue-500"
                     }`}
                  >
                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
               ))}
            </div>

            <div>
               {activeTab === "ongoing" && renderMatches(matches.ongoing)}
               {activeTab === "upcoming" && renderMatches(matches.upcoming)}
               {activeTab === "results" && renderMatches(matches.results)}
            </div>
         </div>
      </div>
   );
}

export default MyMatches;
