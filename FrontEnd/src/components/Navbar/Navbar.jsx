import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <nav className="container mx-auto flex justify-between items-center px-4 py-3">
         {/* Logo */}
         <h1 className="text-2xl font-bold">
            Esport<span className="text-orange-500">X</span>
         </h1>

         {/* Desktop Menu */}
         <div className="hidden md:flex gap-8 font-medium">
            <Link to="/" className="hover:text-orange-500 transition duration-300">Home</Link>
            <Link to="/games" className="hover:text-orange-500 transition duration-300">Games</Link>
            <Link to="/matches" className="hover:text-orange-500 transition duration-300">Matches</Link>
            
            <a
               href="#"
               className="hover:text-orange-500 transition duration-300"
            >
               Leaderboard
            </a>
         </div>

         {/* Join Button (Desktop) */}
         <div className="hidden md:inline-block bg-amber-500 px-6 py-2 rounded-md font-medium hover:bg-amber-600 transition duration-300">
            Join Now
         </div>

         {/* Mobile Menu Button */}
         <div
            className="md:hidden block z-10"
            onClick={() => setIsOpen(!isOpen)}
         >
            {isOpen ? "✖" : "☰"}
         </div>

         {/* Mobile Menu */}
         <div
            className={`absolute inset-0 backdrop-blur-lg flex flex-col items-center justify-center gap-6 text-lg font-medium transition-transform duration-500  ${
               isOpen ? "translate-x-0" : "translate-x-full"
            }`}
         >
            <a
               href="#"
               className="hover:text-orange-700 transition duration-300"
            >
               Games
            </a>
            <a
               href="#"
               className="hover:text-orange-700 transition duration-300"
            >
               Matches
            </a>
            <a
               href="#"
               className="hover:text-orange-700 transition duration-300"
            >
               Leaderboard
            </a>
         </div>
      </nav>
   );
};

export default Navbar;
