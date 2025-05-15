import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

function WithdrawBalance() {
   const [amount, setAmount] = useState("");
   const [upiId, setUpiId] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false);

   const { user, setUser } = useContext(UserContext);
   const token = localStorage.getItem("accessToken");

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const response = await axios.get("https://esport-x.vercel.app/api/v1/users/current-user", {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            setUser(response.data.data);
            localStorage.setItem("user", JSON.stringify(response.data.data));
         } catch {
            setError("Failed to load user data");
         } finally {
            setLoading(false);
         }
      };

      fetchUserData();
   }, [setUser, token]);

   const handleWithdraw = async () => {
      const amt = parseFloat(amount.trim());

      if (!amt || isNaN(amt) || amt < 10) {
         alert("Please enter a valid amount (minimum ₹10)");
         return;
      }

      if (!upiId || !upiId.includes("@")) {
         alert("Please enter a valid UPI ID");
         return;
      }

      if (amt > user.walletBalance) {
         alert("Insufficient wallet balance");
         return;
      }

      setIsProcessing(true);

      try {
         const response = await axios.post(
            "https://esport-x.vercel.app/api/v1/payments",
            {
               amount: amt,
               upiId: upiId.trim(),
               type: "WITHDRAW",
               paymentMethod: "UPI",
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            }
         );

         const updatedUser = response.data?.data?.userUpdated;

         if (updatedUser) {
            alert("Withdrawal request submitted successfully!");
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

         } else {
            alert("Something went wrong. Please try again.");
         }
      } catch (err) {
         console.error(err);
         alert(
            err.response?.data?.message ||
               "An error occurred during the withdrawal process."
         );
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center max-w-xl mx-auto mt-10">
         <h3 className="text-xl font-bold mb-4">Withdraw Balance</h3>

         {loading ? (
            <p className="text-gray-500">Loading...</p>
         ) : error ? (
            <p className="text-red-600">{error}</p>
         ) : (
            <>
               <p className="mb-2 font-medium text-green-600">
                  Current Wallet Balance: ₹{user?.walletBalance?.toFixed(2)}
               </p>

               <input
                  type="number"
                  min="10"
                  className="border p-2 w-full rounded-md mb-3"
                  placeholder="Enter amount (min ₹10)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
               />

               <input
                  type="text"
                  className="border p-2 w-full rounded-md mb-4"
                  placeholder="Enter your UPI ID (e.g. example@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
               />

               <button
                  onClick={handleWithdraw}
                  disabled={isProcessing}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 w-full justify-center hover:bg-red-500 transition ${
                     isProcessing && "opacity-50 cursor-not-allowed"
                  }`}
               >
                  {isProcessing ? (
                     "Processing..."
                  ) : (
                     <>
                        <FontAwesomeIcon icon={faMoneyCheckAlt} /> Withdraw Now
                     </>
                  )}
               </button>
            </>
         )}
      </div>
   );
}

export default WithdrawBalance;
