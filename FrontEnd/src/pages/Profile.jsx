import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faEnvelope,
  faWallet,
  faEdit,
  faLock,
  faGamepad,
  faSignOutAlt,
  faTachometerAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import UpdateProfile from "../components/UpdateProfile/UpdateProfile";
import UpdateAvatar from "../components/UpdateAvatar/UpdateAvatar";
import UpdatePassword from "../components/UpdatePassword/UpdatePassword";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import MyMatches from "../components/MyMatches/MyMatches";
import DepositBalanceCard from "../components/DepositBalance/DepositBalance";
import WithdrawBalance from "../components/WithdrawBalance/WithdrawBalance";
import TransactionHistory from "../components/TransactionHistory/TransactionHistory";

function ProfileDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ProfileCard />;
      case "matches":
        return <MyMatches />;
      case "deposit":
        return <DepositBalanceCard />;
      case "withdraw":
        return <WithdrawBalance />;
      case "transactions":
        return <TransactionHistory />;
      case "updateProfile":
        return <UpdateProfile />;
      case "updateAvatar":
        return <UpdateAvatar />;
      case "updatePassword":
        return <UpdatePassword />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-4 bg-gray-800 text-white fixed top-0 left-0 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed md:relative top-0 left-0 h-full w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="text-center mb-6">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-20 h-20 rounded-full mx-auto border mb-3"
            />
            <h2 className="text-xl font-semibold">{user?.username}</h2>
            <p className="text-gray-400 text-sm">
              <FontAwesomeIcon icon={faEnvelope} /> {user?.email}
            </p>
            <p className="text-green-400 font-semibold mt-2">
              <FontAwesomeIcon icon={faWallet} /> ${user?.walletBalance}
            </p>
          </div>

          <nav className="space-y-3">
            {[
              {
                name: "Dashboard",
                icon: faTachometerAlt,
                section: "dashboard",
              },
              { name: "See My Matches", icon: faGamepad, section: "matches" },
              { name: "Deposit Balance", icon: faWallet, section: "deposit" },
              { name: "Withdraw Balance", icon: faWallet, section: "withdraw" },
              {
                name: "Transaction History",
                icon: faHistory,
                section: "transactions",
              },
              {
                name: "Update Profile",
                icon: faEdit,
                section: "updateProfile",
              },
              { name: "Update Avatar", icon: faEdit, section: "updateAvatar" },
              {
                name: "Update Password",
                icon: faLock,
                section: "updatePassword",
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
            <button className="w-full text-left py-2 px-4 bg-red-600 rounded-lg hover:bg-red-500">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome, {user?.username}
          </h2>
          {renderContent()}
        </main>
      </div>
    </>
  );
}

export default ProfileDashboard;
