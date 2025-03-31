const GamerReviews = () => {
   const reviews = [
      {
         id: 1,
         name: "Brice Tong",
         location: "Texas, USA",
         earnings: "$306",
         review:
            "I play Tournament every day, it's a great way to relax and win cash too!",
         image: "/assets/gamer-reviews/Rohan.jpg",
      },
      {
         id: 2,
         name: "Alva Adair",
         location: "Frankfurt, Germany",
         earnings: "$496",
         review:
            "When I hang out with my friends, we play Tournament, it's so much fun.",
         image: "/assets/gamer-reviews/Rohan.jpg",
      },
      {
         id: 3,
         name: "Alva Adair",
         location: "Frankfurt, Germany",
         earnings: "$496",
         review:
            "When I hang out with my friends, we play Tournament, it's so much fun.",
         image: "/assets/gamer-reviews/Rohan.jpg",
      },
   ];

   return (
      <section className="container mx-auto text-center py-16 px-6">
         <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-500">Gamers Review</span>
         </h2>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Thousands of Happy Gamers All Around the World
         </p>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
               <div
                  key={review.id}
                  className="bg-white shadow-lg rounded-lg p-6 text-center"
               >
                  <img
                     src={review.image}
                     alt={review.name}
                     className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-700 italic">"{review.review}"</p>
                  <h3 className="mt-4 text-lg font-semibold">{review.name}</h3>
                  <p className="text-gray-500">{review.location}</p>
                  {review.earnings && (
                     <span className="text-green-500 font-bold text-lg">
                        {review.earnings}
                     </span>
                  )}
               </div>
            ))}
         </div>
      </section>
   );
};

export default GamerReviews;
