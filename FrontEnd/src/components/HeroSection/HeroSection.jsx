import { Link } from "react-router-dom";
import GamerImage from "../../assets/Gamer.png"; 
const HeroSection = () => {
   return (
      <div className="container mx-auto px-6 py-16 text-center lg:text-left flex flex-col-reverse lg:flex-row items-center gap-8">
         {/* Left Content */}
         <div className="lg:w-2/3 space-y-5 ">
            <h1 className="text-3xl lg:text-6xl font-bold pb-3 text-gray-900 ">
               Join the{" "}
               <span className="text-orange-500">Ultimate Gaming Battles</span>
            </h1>
            <p className="text-lg text-gray-700 ">
               Compete, dominate, and win big in the most thrilling gaming
               tournaments. Step into the arena and showcase your skills against
               top players worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
               <Link
                  to="/login"
                  className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition duration-300"
               >
                  Join Now
               </Link>
               <Link
                  to="/games"
                  className="border border-orange-500 text-orange-500 px-6 py-3 rounded-md font-medium hover:bg-orange-500 hover:text-white transition duration-300"
               >
                  Explore Games
               </Link>
            </div>
         </div>

         {/* Right Image */}
         <div className="lg:w-1/2">
            <img
               src={GamerImage}
               alt="EsportX Hero"
               className="w-full max-w-md mx-auto lg:mx-0"
            />
         </div>
      </div>
   );
};

export default HeroSection;
