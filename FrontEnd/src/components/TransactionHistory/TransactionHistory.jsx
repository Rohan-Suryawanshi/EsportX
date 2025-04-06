import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faArrowDown,
   faArrowUp,
   faCreditCard,
   faBank,
   faWallet,
} from "@fortawesome/free-solid-svg-icons";

function TransactionHistory() {
   const [transactions, setTransactions] = useState([]);
   const [activeTab, setActiveTab] = useState("all");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const token = localStorage.getItem("accessToken");

   useEffect(() => {
      const fetchTransactions = async () => {
         try {
            const response = await axios.get("/api/v1/payments/user", {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            });
            setTransactions(response.data?.data || []);
         } catch (err) {
            console.error(err);
            setError("Failed to load transactions");
         } finally {
            setLoading(false);
         }
      };

      fetchTransactions();
   }, [token]);

   const filterTransactions = (type) => {
      if (type === "all") return transactions;
      return transactions.filter((tx) => tx.type.toLowerCase() === type);
   };

   const getMethodIcon = (method) => {
      const m = method?.toLowerCase();
      if (m.includes("bank")) return faBank;
      if (m.includes("wallet")) return faWallet;
      return faCreditCard;
   };

   const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString();
   };

   const getStatusBadge = (status) => {
      const base = "px-2 py-1 text-xs rounded-full font-semibold";
      switch (status?.toLowerCase()) {
         case "pending":
            return `${base} bg-yellow-100 text-yellow-600`;
         case "failed":
            return `${base} bg-red-100 text-red-600`;
         case "success":
         default:
            return `${base} bg-green-100 text-green-600`;
      }
   };

   return (
      <div className="max-w-3xl mx-auto mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
         {/* Tabs */}
         <div className="flex justify-around border-b mb-6">
            {["all", "deposit", "withdraw"].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-6 text-lg font-medium transition-colors duration-300 ${
                     activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-blue-500"
                  }`}
               >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
               </button>
            ))}
         </div>

         {/* Transaction List */}
         {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
         ) : error ? (
            <p className="text-center text-red-500">{error}</p>
         ) : filterTransactions(activeTab).length === 0 ? (
            <p className="text-gray-500 text-center py-4">
               No transactions found
            </p>
         ) : (
            <div className="space-y-4 animate-fade-in">
               {filterTransactions(activeTab).map((tx, index) => (
                  <div
                     key={index}
                     className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition duration-300 border border-gray-200 flex justify-between items-center"
                  >
                     {/* Left Section */}
                     <div className="flex items-center gap-4">
                        <FontAwesomeIcon
                           icon={
                              tx.type.toLowerCase() === "deposit"
                                 ? faArrowDown
                                 : faArrowUp
                           }
                           className={`text-2xl ${
                              tx.type.toLowerCase() === "deposit"
                                 ? "text-green-500"
                                 : "text-red-500"
                           }`}
                        />
                        <div>
                           <p className="capitalize text-gray-800 font-medium">
                              {tx.type} via{" "}
                              <span className="font-semibold text-blue-600">
                                 {tx.method || "N/A"}
                              </span>
                           </p>
                           <p className="text-sm text-gray-400">
                              {formatTime(tx.createdAt)}
                           </p>
                           <div className="mt-1">
                              <span
                                 className={getStatusBadge(
                                    tx.status || "success"
                                 )}
                              >
                                 {tx.status || "Success"}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Right Section */}
                     <div className="flex flex-col items-end">
                        <p
                           className={`text-xl font-bold ${
                              tx.type.toLowerCase() === "deposit"
                                 ? "text-green-600"
                                 : "text-red-600"
                           }`}
                        >
                           ₹{tx.amount}
                        </p>
                        <FontAwesomeIcon
                           icon={getMethodIcon(tx.method || "")}
                           className="text-gray-400 mt-1"
                           title={tx.method}
                        />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default TransactionHistory;
