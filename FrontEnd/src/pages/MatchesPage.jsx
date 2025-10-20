import React, { useState } from "react";
import MatchParticipantsModal from "../components/MatchParticipantsModal";
import Seo from "../components/Seo";

const MatchesPage = ({ matches }) => {
   const [selectedMatchId, setSelectedMatchId] = useState(null);

   return (
      <div className="p-6">
            <Seo
               title="Matches"
               description="Browse upcoming and ongoing matches on Esport-X. Join matches and track participants."
               url="/matches"
            />
         <h1 className="text-2xl font-bold">Matches</h1>
         <table className="w-full border mt-4">
            <thead>
               <tr className="bg-gray-200">
                  <th className="p-2">Match ID</th>
                  <th className="p-2">Total Players</th>
                  <th className="p-2">Actions</th>
               </tr>
            </thead>
            <tbody>
               {matches.map((match) => (
                  <tr key={match._id}>
                     <td className="p-2">{match._id}</td>
                     <td className="p-2">
                        {match.totalPlayersJoined}/{match.maxPlayers}
                     </td>
                     <td className="p-2">
                        <button
                           onClick={() => setSelectedMatchId(match._id)}
                           className="bg-blue-500 text-white px-3 py-1 rounded-full"
                        >
                           View Participants
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {selectedMatchId && (
            <MatchParticipantsModal
               matchId={selectedMatchId}
               onClose={() => setSelectedMatchId(null)}
            />
         )}
      </div>
   );
};

export default MatchesPage;
