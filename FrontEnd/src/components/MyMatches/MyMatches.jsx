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
   const [allJoinedMatches, setAllJoinedMatches] = useState([]);
   const [loading, setLoading] = useState(true);
   const token = localStorage.getItem("accessToken");

   useEffect(() => {
      const fetchJoinedMatches = async () => {
         try {
            const response = await axios.get("/api/v1/users/joined-matches", {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            });

            const validMatches = response.data.data.filter(
               (m) => m.matchId !== null
            );

            setAllJoinedMatches(validMatches);
         } catch (error) {
            console.error("Error fetching joined matches:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchJoinedMatches();
   }, []);

   const filterMatchesByStatus = (status) => {
      return allJoinedMatches
         .filter((item) => item.matchId?.status === status.toUpperCase())
         .map((item) => item.matchId); // Extract match details
   };

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
         const incomeEstimate = match.perKill * 3;

         // Check if roomId and roomPassword are not empty
         const showRoomDetails =
            match.roomId &&
            match.roomId !== "Empty" &&
            match.roomPassword &&
            match.roomPassword !== "Empty";

         // Handle copy to clipboard
         const handleCopy = (text) => {
            navigator.clipboard.writeText(text);
         };

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

               {showRoomDetails && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                     <p className="flex items-center justify-between">
                        <span>
                           <strong>Room ID:</strong> {match.roomId}
                        </span>
                        <button
                           onClick={() => handleCopy(match.roomId)}
                           className="px-4 py-1 text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        >
                           Copy
                        </button>
                     </p>
                     <p className="flex items-center justify-between mt-1">
                        <span>
                           <strong>Password:</strong> {match.roomPassword}
                        </span>
                        <button
                           onClick={() => handleCopy(match.roomPassword)}
                           className="px-4 py-1 text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        >
                           Copy
                        </button>
                     </p>
                  </div>
               )}
            </div>
         );
      });
   };

   const tabs = ["ongoing", "upcoming", "complete"];

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

            <div>{renderMatches(filterMatchesByStatus(activeTab))}</div>
         </div>
      </div>
   );
}

export default MyMatches;
