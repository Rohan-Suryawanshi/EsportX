const HowItWorks = () => {
   const steps = [
      {
         id: 1,
         title: "Signup",
         image: "/assets/steps/how-icon-1.png",
         bgColor: "bg-gray-800",
      },
      {
         id: 2,
         title: "Deposit",
         image: "/assets/steps/how-icon-2.png",
         bgColor: "bg-gray-800",
      },
      {
         id: 3,
         title: "Compete",
         image: "/assets/steps/how-icon-3.png",
         bgColor: "bg-gray-800",
      },
      {
         id: 4,
         title: "Get Paid",
         image: "/assets/steps/how-icon-4.png",
         bgColor: "bg-gray-800",
      },
   ];

   return (
      <section className="container mx-auto text-center py-16 px-6 bg-gray-700 text-white">
         <h2 className="text-4xl font-bold text-white mb-6">
            How <span className="text-orange-500">It Works</span>
         </h2>
         <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            It's easier than you think. Follow 4 simple steps and start
            competing today!
         </p>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step) => (
               <div
                  key={step.id}
                  className={`flex flex-col items-center p-6 rounded-lg shadow-lg ${step.bgColor}`}
               >
                  <img
                     src={step.image}
                     alt={step.title}
                     className="w-10 h-10 object-contain mb-4"
                  />
                  <h3 className="text-xl font-semibold">{step.title}</h3>
               </div>
            ))}
         </div>

         <a
            href="#"
            className="mt-10 inline-block bg-amber-500 px-7 py-3 rounded-md font-medium text-white hover:bg-amber-600 transition duration-300"
         >
            Join Now!
         </a>
      </section>
   );
};

export default HowItWorks;
