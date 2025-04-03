import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

function DepositBalanceCard() {
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: amount * 100,
      currency: "INR",
      name: "Your App Name",
      description: "Deposit Balance",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-md text-center max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Deposit Balance</h3>
      <input
        type="number"
        className="border p-2 w-full rounded-md mb-4"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handlePayment}
        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 w-full justify-center"
      >
        <FontAwesomeIcon icon={faMoneyBillWave} /> Pay Now
      </button>
    </div>
  );
}

export default DepositBalanceCard;
