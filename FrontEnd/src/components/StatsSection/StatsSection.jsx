const StatsSection = () => {
   const stats = [
      {
         id: 1,
         value: "17K",
         label: "Matches Played",
         image: "/assets/counter/counter-icon-1.png",
      },
      {
         id: 2,
         value: "$20M",
         label: "Winnings Paid",
         image: "/assets/counter/counter-icon-2.png",
      },
      {
         id: 3,
         value: "37",
         label: "Active Ladders",
         image: "/assets/counter/counter-icon-3.png",
      },
      {
         id: 4,
         value: "35B",
         label: "XP Earned",
         image: "/assets/counter/counter-icon-4.png",
      },
   ];

   return (
      <section className="container mx-auto text-center py-16 px-6">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
               <div
                  key={stat.id}
                  className="bg-gray-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center transform transition-all hover:scale-105"
               >
                  <img
                     src={stat.image}
                     alt={stat.label}
                     className="w-16 h-16 object-contain mb-4"
                  />
                  <h3 className="text-3xl font-bold text-orange-500">
                     {stat.value}
                  </h3>
                  <p className="text-gray-300 text-lg">{stat.label}</p>
               </div>
            ))}
         </div>
      </section>
   );
};

export default StatsSection;
