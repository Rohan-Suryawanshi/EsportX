import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);

   const { user, isLoggedIn } = useContext(UserContext);

   const toggleMenu = () => setIsOpen(!isOpen);
   const closeMenu = () => setIsOpen(false);

   return (
      <nav className="container mx-auto flex justify-between items-center px-12 sm:px-3 lg:px-4 py-3 relative">
         {/* Logo */}
         <h1 className="text-2xl font-bold">
            Esport<span className="text-orange-500">X</span>
         </h1>

         {/* Desktop Menu */}
         <div className="hidden md:flex gap-8 font-medium">
            <Link to="/" className="hover:text-orange-500" onClick={closeMenu}>
               Home
            </Link>
            <Link
               to="/games"
               className="hover:text-orange-500"
               onClick={closeMenu}
            >
               Games
            </Link>
            {/* <Link
               to="/matches"
               className="hover:text-orange-500"
               onClick={closeMenu}
            >
               Matches
            </Link> */}
            <Link
               to="/leaderboard"
               className="hover:text-orange-500"
               onClick={closeMenu}
            >
               Leaderboard
            </Link>
         </div>

         {/* Desktop Right */}
         <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
               <div className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-md">
                  ₹{user?.walletBalance?.toFixed(2)}
               </div>
            )}
            {!isLoggedIn ? (
               <Link
                  to="/login"
                  className="bg-amber-500 px-6 py-2 rounded-md font-medium hover:bg-amber-600 transition"
               >
                  Join Now
               </Link>
            ) : (
               <Link
                  to="/profile"
                  className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition"
               >
                  My Account
               </Link>
            )}
         </div>

         {/* Mobile Menu Button */}
         <button
            onClick={toggleMenu}
            className="md:hidden z-30 text-2xl focus:outline-none"
         >
            {isOpen ? "✖" : "☰"}
         </button>

         {/* Mobile Menu */}
         <div
            className={`md:hidden fixed top-0 right-0 w-full h-screen backdrop-blur-sm flex flex-col items-center justify-center gap-6 text-lg font-medium transition-transform duration-500 z-20 ${
               isOpen ? "translate-x-0" : "translate-x-full"
            }`}
         >
            <Link to="/" onClick={closeMenu} className="hover:text-orange-500">
               Home
            </Link>
            <Link
               to="/games"
               onClick={closeMenu}
               className="hover:text-orange-500"
            >
               Games
            </Link>
            {/* <Link
               to="/matches"
               onClick={closeMenu}
               className="hover:text-orange-500"
            >
               Matches
            </Link> */}
            <Link
               to="/leaderboard"
               onClick={closeMenu}
               className="hover:text-orange-500"
            >
               Leaderboard
            </Link>

            {isLoggedIn && (
               <div className="text-sm font-semibold text-green-600 bg-green-100 px-4 py-1 rounded-md">
                  Balance: ₹{user?.walletBalance?.toFixed(2)}
               </div>
            )}

            {!isLoggedIn ? (
               <Link
                  to="/login"
                  onClick={closeMenu}
                  className="bg-amber-500 px-6 py-2 rounded-md font-medium hover:bg-amber-600 transition"
               >
                  Join Now
               </Link>
            ) : (
               <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition"
               >
                  My Account
               </Link>
            )}
         </div>
      </nav>
   );
};

export default Navbar;
