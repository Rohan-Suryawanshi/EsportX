import { useState } from "react";

function TransactionHistory({ transactions = [] }) {  // Default to empty array
  const [activeTab, setActiveTab] = useState("all");

  const filterTransactions = (type) => {
    if (type === "all") return transactions;
    return transactions.filter((tx) => tx.type === type);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Tabs */}
      <div className="flex justify-around border-b mb-4">
        {["all", "deposit", "withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-lg font-semibold ${
              activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div>
        {filterTransactions(activeTab).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found</p>
        ) : (
          filterTransactions(activeTab).map((tx, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md mb-3 border border-gray-200 flex justify-between"
            >
              <span className="text-gray-700">{tx.type}</span>
              <span
                className={`text-lg font-semibold ${
                  tx.type === "Deposit" ? "text-green-500" : "text-red-500"
                }`}
              >
                ₹{tx.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
