import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";

function WithdrawBalance() {
  const [amount, setAmount] = useState("");

  const handleWithdraw = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Handle withdrawal logic here (API integration)
    alert(`Withdrawal request of ₹${amount} submitted successfully!`);
    setAmount("");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center max-w-xl mx-auto mt-10">
      <h3 className="text-xl font-bold mb-4">Withdraw Balance</h3>
      <input
        type="number"
        className="border p-2 w-full rounded-md mb-4"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handleWithdraw}
        className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 w-full justify-center"
      >
        <FontAwesomeIcon icon={faMoneyCheckAlt} /> Withdraw Now
      </button>
    </div>
  );
}

export default WithdrawBalance;
