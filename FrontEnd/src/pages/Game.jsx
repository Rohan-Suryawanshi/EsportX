import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo";


const comingSoonGames = [
   { name: "Apex Legends Mobile", image: "/assets/games/Valorant.png" },
   { name: "Fortnite Mobile", image: "/assets/games/Valorant.png" },
];

function GamePage() {
   const [games, setGames] = useState([]);
   const navigate = useNavigate();
   useEffect(() => {
      const fetchMatches = async () => {
         try {
            const response = await axios.get(
               `https://esport-x.vercel.app/api/v1/games`
            );
            if (response.data.success) {
               setGames(response.data.data);
            }
         } catch (error) {
            console.error("Error fetching matches:", error);
         }
      };
      fetchMatches();
   }, []);

   return (
      <>
         <Seo title="Games" description="Browse available games on Esport-X and join matches for your favorite titles." url="/games" />
         <Navbar />
         <div className="min-h-screen  p-8">
            <h1 className="text-3xl font-bold text-center mb-8">
               Available <span className="text-orange-500">Games</span>
            </h1>
            <p className="text-center text-lg text-gray-600 mb-6">
               Choose from a variety of competitive games and showcase your
               skills on the battlefield.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               {games.map((game, index) => (
                  <div key={index} className="cursor-pointer">
                     <div className="overflow-hidden shadow-lg rounded-2xl border border-gray-200 bg-white">
                        <img
                           src={game.image}
                           alt={game.name}
                           className="w-full h-80 object-cover object-top"
                        />
                        <div className="p-6 text-center">
                           <h3 className="text-xl font-semibold mb-4">
                              {game.name}
                           </h3>
                           <button
                              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                              onClick={() =>
                                 navigate(`/matches/games/${game._id}`)
                              }
                           >
                              Join Now
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">
               Coming <span className="text-orange-500">Soon</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {comingSoonGames.map((game, index) => (
                  <div key={index} className="cursor-pointer">
                     <div className="overflow-hidden shadow-lg rounded-2xl border border-gray-200 bg-white opacity-75">
                        <img
                           src={game.image}
                           alt={game.name}
                           className="w-full h-80 object-cover object-top"
                        />
                        <div className="p-6 text-center">
                           <h3 className="text-xl font-semibold mb-4">
                              {game.name}
                           </h3>
                           <span className="text-gray-500">Coming Soon...</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
}

export default GamePage;
