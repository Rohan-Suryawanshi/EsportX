const games = [
   {
      name: "PUBG Mobile",
      image: "/assets/games/Pubg_New_State.png",
   },
   {
      name: "Free Fire",
      image: "/assets/games/FFM.png",
   },
   {
      name: "Call of Duty Mobile",
      image: "/assets/games/BGMI.png",
   },
   {
      name: "Valorant",
      image: "/assets/games/Valorant.png",
   },
];

const AvailableGames = () => {
   return (
      <div className="container mx-auto px-6 py-16 text-center" id="games">
         <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Available <span className="text-orange-500">Games</span>
         </h2>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Choose from a variety of competitive games and showcase your skills
            on the battlefield.
         </p>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
               <div
                  key={index}
                  className="bg-orange-400 text-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
               >
                  <img
                     src={game.image}
                     alt={game.name}
                     className="w-full h-72 object-cover object-top"
                  />
                  <div className="p-4">
                     <h3 className="text-xl font-semibold">{game.name}</h3>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default AvailableGames;
