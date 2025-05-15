import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const DepositBalance = () => {
   const [isLoading, setIsLoading] = useState(true);
   const [rzpLoaded, setRzpLoaded] = useState(false);
   const [amount, setAmount] = useState("");
   const [errorMsg, setErrorMsg] = useState("");
   const [paymentSuccess, setPaymentSuccess] = useState(false);

   const { user, setUser } = useContext(UserContext);
   const token = localStorage.getItem("accessToken");

   // Load Razorpay script on mount
   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
         setRzpLoaded(true);
         setIsLoading(false);
      };
      script.onerror = () => {
         console.error("Failed to load Razorpay SDK");
         setIsLoading(false);
      };
      document.body.appendChild(script);
   }, []);

   const handlePayment = async () => {
      setErrorMsg("");
      setPaymentSuccess(false);

      const amt = parseInt(amount);

      if (!amt || isNaN(amt) || amt < 1) {
         setErrorMsg("Please enter a valid amount (minimum ₹1).");
         return;
      }

      try {
         // Create Razorpay order from backend
         const { data } = await axios.post(
            "https://esport-x.vercel.app/api/v1/payments/create-order",
            { amount: amt * 100 },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            }
         );

         console.log("Order Created:", data);

         const options = {
            key: "rzp_test_V9xZLqCZgTdqOc", // Replace with LIVE key in production
            amount: data.amount,
            currency: data.currency,
            name: "Esport-X",
            description: "Wallet Top-up",
            order_id: data.id,
            handler: async function (response) {
               try {
                  console.log("Razorpay Response:", response);

                  const verifyRes = await axios.post(
                     "http://localhost:3000https://esport-x.vercel.app/api/v1/payments/verify-payment",
                     {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        amount,
                     },
                     {
                        headers: {
                           Authorization: `Bearer ${token}`,
                           "Content-Type": "application/json",
                        },
                     }
                  );

                  const updatedUser = verifyRes.data?.data?.userUpdated;
                  console.log("User After Update:", updatedUser);

                  if (updatedUser) {
                     setUser(updatedUser);
                     localStorage.setItem("user", JSON.stringify(updatedUser));
                     setPaymentSuccess(true);
                     setAmount("");
                  } else {
                     setErrorMsg("User update failed after payment.");
                  }

               } catch (err) {
                  console.error("Verification Error:", err);
                  setErrorMsg(
                     "Something went wrong during payment verification."
                  );
               }
            },
            prefill: {
               name: user?.name || "User",
               email: user?.email || "user@example.com",
            },
            theme: {
               color: "#6366f1",
            },
         };

         const rzp = new window.Razorpay(options);
         rzp.open();
      } catch (err) {
         console.error("Create Order Error:", err);
         setErrorMsg("Failed to initiate payment. Please try again.");
      }
   };

   return (
      <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center max-w-xl mx-auto mt-10">
         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Deposit Balance
         </h1>

         <p className="text-gray-700 font-medium mb-4">
            Current Wallet Balance: ₹{user?.walletBalance?.toFixed(2) ?? 0}
         </p>

         <label htmlFor="amount" className="block text-gray-600 mb-1">
            Enter Amount (in ₹)
         </label>
         <input
            type="number"
            id="amount"
            placeholder="e.g. 100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
         />

         {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
         {paymentSuccess && (
            <p className="text-green-600 text-sm mt-2">Payment successful!</p>
         )}

         <button
            onClick={handlePayment}
            disabled={!rzpLoaded || isLoading}
            className={`mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition ${
               (!rzpLoaded || isLoading) && "opacity-50 cursor-not-allowed"
            }`}
         >
            {isLoading ? "Loading Razorpay..." : `Pay ₹${amount || 0}`}
         </button>

         {!rzpLoaded && !isLoading && (
            <p className="text-red-500 text-sm mt-3 text-center">
               Failed to load Razorpay. Please refresh the page.
            </p>
         )}
      </div>
   );
};

export default DepositBalance;
