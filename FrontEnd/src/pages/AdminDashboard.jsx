import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBars,
   faUsersCog,
   faGamepad,
   faMoneyCheckAlt,
   faSignOutAlt,
   faTachometerAlt,
   faEnvelope,
   faUserShield,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../components/Navbar/Navbar";
import TournamentManagement from "../components/TournamentManagement/TournamentManagement.jsx";

import { UserContext } from "../context/UserContext";
import AdminPaymentDashboard from "../components/AdminPaymentDashboard/AdminPaymentDashboard.jsx";
import AdminUserManagement from "../components/AdminUserManagement/AdminUserManagement.jsx";
import AdminGamePage from "../components/AdminGamePage/AdminGamePage.jsx";

function AdminDashboard() {
   const { user, logout } = useContext(UserContext);
   const [activeSection, setActiveSection] = useState("Game");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate("/login");
   };

   const renderContent = () => {
      switch (activeSection) {
         case "Game":
            return  <AdminGamePage/>;
         case "Payment":
            return <AdminPaymentDashboard />;
         case "Tournament":
            return <TournamentManagement />;
         case "Users":
            return <AdminUserManagement />;
         default:
            return null;
      }
   };

   return (
      <>
         <Navbar />
         <div className="flex flex-col md:flex-row min-h-screen">
            <button
               className="md:hidden p-4 bg-gray-800 text-white fixed top-0 left-0 z-50"
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
               <FontAwesomeIcon icon={faBars} />
            </button>

            <aside
               className={`fixed md:relative top-0 left-0 h-full w-64 bg-gray-900 text-white p-5 flex flex-col space-y-4 transform ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
               } md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
               <div className="text-center mb-6">
                  <FontAwesomeIcon icon={faUserShield} size="2x" />
                  <h2 className="text-xl font-bold mt-2">Admin Panel</h2>
                  <p className="text-gray-400 text-sm">
                     <FontAwesomeIcon icon={faEnvelope} /> {user?.email}
                  </p>
               </div>

               <nav className="space-y-3">
                  {[
                     {
                        name: "Game",
                        icon: faTachometerAlt,
                        section: "Game",
                     },
                     {
                        name: "Payment",
                        icon: faUsersCog,
                        section: "Payment",
                     },
                     {
                        name: "Tournament",
                        icon: faGamepad,
                        section: "Tournament",
                     },
                     {
                        name: "Users",
                        icon: faMoneyCheckAlt,
                        section: "Users",
                     },
                  ].map(({ name, icon, section }) => (
                     <button
                        key={section}
                        onClick={() => {
                           setActiveSection(section);
                           setIsSidebarOpen(false);
                        }}
                        className="w-full text-left py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600"
                     >
                        <FontAwesomeIcon icon={icon} className="mr-2" /> {name}
                     </button>
                  ))}

                  <button
                     className="w-full text-left py-2 px-4 bg-red-600 rounded-lg hover:bg-red-500"
                     onClick={handleLogout}
                  >
                     <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />{" "}
                     Logout
                  </button>
               </nav>
            </aside>

            <main className="flex-1 p-6">
               <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                  Welcome, Admin {user?.username}
               </h2>
               {renderContent()}
            </main>
         </div>
      </>
   );
}

export default AdminDashboard;
