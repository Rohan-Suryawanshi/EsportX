import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faEye,
   faCheckCircle,
   faTimesCircle,
   faSortDown,
   faSortUp,
} from "@fortawesome/free-solid-svg-icons";

const AdminPaymentDashboard = () => {
   const [transactions, setTransactions] = useState([]);
   const [filteredTransactions, setFilteredTransactions] = useState([]);
   const [selectedTxn, setSelectedTxn] = useState(null);
   const [showModal, setShowModal] = useState(false);
   const [activeTab, setActiveTab] = useState("ALL");
   const [sortOrder, setSortOrder] = useState("desc"); // desc or asc

   const token = localStorage.getItem("accessToken");
   const fetchTransactions = async () => {
      try {
         const res = await fetch("/api/v1/payments", {
            method: "GET",
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         });
         const data = await res.json();
         setTransactions(data.data || []);
      } catch (error) {
         console.error("Failed to fetch transactions:", error);
      }
   };

   useEffect(() => {
      fetchTransactions();
   }, []);

   useEffect(() => {
      let filtered = [...transactions];
      if (activeTab !== "ALL") {
         filtered = filtered.filter(
            (txn) => txn.type?.toUpperCase() === activeTab
         );
      }

      filtered.sort((a, b) => {
         const dateA = new Date(a.createdAt);
         const dateB = new Date(b.createdAt);
         return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      setFilteredTransactions(filtered);
   }, [transactions, activeTab, sortOrder]);

   const handleStatusUpdate = async (id, action) => {
      try {
         await fetch(`/api/v1/payments/${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: action }),
         });
         fetchTransactions();
      } catch (error) {
         console.error(`${action} failed:`, error);
      }
   };

   const tabs = ["ALL", "DEPOSIT", "WITHDRAW"];

   return (
      <div className="p-4">
         <h2 className="text-2xl font-bold mb-4">
            Payment & Withdrawal Management
         </h2>

         {/* Tabs */}
         <div className="flex gap-4 mb-4">
            {tabs.map((tab) => (
               <button
                  key={tab}
                  className={`px-4 py-2 rounded ${
                     activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
               >
                  {tab}
               </button>
            ))}

            {/* Sort Button */}
            <button
               onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
               }
               className="ml-auto flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
               Sort by Date{" "}
               <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-2"
               />
            </button>
         </div>

         {/* Table */}
         <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full text-sm">
               <thead>
                  <tr className="bg-gray-100 text-left font-semibold text-sm">
                     <th className="p-3">User</th>
                     <th className="p-3">Amount</th>
                     <th className="p-3">Type</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Date</th>
                     <th className="p-3">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredTransactions.length === 0 ? (
                     <tr>
                        <td
                           colSpan={6}
                           className="text-center p-4 text-gray-500"
                        >
                           No transactions found.
                        </td>
                     </tr>
                  ) : (
                     filteredTransactions.map((txn) => (
                        <tr key={txn._id} className="border-t hover:bg-gray-50">
                           <td className="p-3">{txn.user?.name}</td>
                           <td className="p-3">₹{txn.amount}</td>
                           <td className="p-3 capitalize">{txn.type}</td>
                           <td className="p-3">
                              <span
                                 className={`px-2 py-1 rounded text-xs font-medium ${
                                    txn.status === "success"
                                       ? "bg-green-100 text-green-700"
                                       : txn.status === "failed"
                                       ? "bg-red-100 text-red-700"
                                       : "bg-yellow-100 text-yellow-800"
                                 }`}
                              >
                                 {txn.status}
                              </span>
                           </td>
                           <td className="p-3">
                              {format(new Date(txn.createdAt), "dd MMM yyyy")}
                           </td>
                           <td className="p-3 flex flex-wrap gap-2">
                              <button
                                 onClick={() => {
                                    setSelectedTxn(txn);
                                    setShowModal(true);
                                 }}
                                 className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                              >
                                 <FontAwesomeIcon
                                    icon={faEye}
                                    className="mr-1"
                                 />
                                 View
                              </button>

                              {txn.status === "pending" && (
                                 <>
                                    <button
                                       onClick={() =>
                                          handleStatusUpdate(txn._id, "success")
                                       }
                                       className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                       <FontAwesomeIcon
                                          icon={faCheckCircle}
                                          className="mr-1"
                                       />
                                       Approve
                                    </button>
                                    <button
                                       onClick={() =>
                                          handleStatusUpdate(txn._id, "failed")
                                       }
                                       className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                       <FontAwesomeIcon
                                          icon={faTimesCircle}
                                          className="mr-1"
                                       />
                                       Reject
                                    </button>
                                 </>
                              )}
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>

         {/* Modal */}
         {showModal && selectedTxn && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
               <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">
                     Transaction Details
                  </h3>
                  <div className="space-y-2 text-sm">
                     <p>
                        <strong>User:</strong> {selectedTxn.userId?.username}
                     </p>
                     <p>
                        <strong>Amount:</strong> ₹{selectedTxn.amount}
                     </p>
                     <p>
                        <strong>Type:</strong> {selectedTxn.type}
                     </p>
                     <p>
                        <strong>Status:</strong> {selectedTxn.status}
                     </p>
                     <p>
                        <strong>Transaction ID:</strong> {selectedTxn.upiId}
                     </p>
                     <p>
                        <strong>Date:</strong>{" "}
                        {format(new Date(selectedTxn.createdAt), "PPpp")}
                     </p>
                  </div>
                  <button
                     onClick={() => setShowModal(false)}
                     className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminPaymentDashboard;
