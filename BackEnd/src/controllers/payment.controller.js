import { Payment } from "../models/payments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/user.model.js";

// Create a new payment
const createWithdrawRequest = AsyncHandler(async (req, res) => {
  const { paymentMethod, amount, upiId } = req.body;
  const userId = req.user?._id;

  if (!paymentMethod) throw new ApiError(400, "Payment method is required");

  if (!amount || amount <= 0)
    throw new ApiError(400, "Valid amount is required");

  // Fetch user
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Check if user has sufficient balance
  if (user.walletBalance < amount) {
    throw new ApiError(400, "Insufficient wallet balance");
  }

  // Create withdraw request
  const newPayment = new Payment({
    userId,
    paymentMethod,
    amount,
    upiId,
    type: "WITHDRAW",
    status: "pending",
  });

  const savedPayment = await newPayment.save();

  // Deduct balance only after saving the withdrawal request
  user.walletBalance -= amount;
  await user.save();

  const userUpdated = await User.findById(userId).select("-password -refreshToken");


  return res.status(201).json(
    new ApiResponse(
      201,
      {
        payment: savedPayment,
        userUpdated,
      },
      "Withdraw request created and wallet balance updated successfully"
    )
  );
});

// Get all payments (Admin only)
const getAllPayments = AsyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, payments, "All payments fetched successfully"));
});

// Get a single payment by ID
const getPaymentById = AsyncHandler(async (req, res) => {
  const paymentId = req.params.id;

  const payment = await Payment.findById(paymentId).populate(
    "userId",
    "username email"
  );
  if (!payment) throw new ApiError(404, "Payment not found");

  res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment fetched successfully"));
});

// Get payments for a specific user
const getUserPayments = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log("My id is"+userId);

  const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, payments, "User payments fetched successfully"));
});

// Update payment status (Admin only)
const updatePaymentStatus = AsyncHandler(async (req, res) => {
  const paymentId = req.params.id;
  const { status } = req.body;

  if (!status) throw new ApiError(400, "Status is required");

  const updatedPayment = await Payment.findByIdAndUpdate(
    paymentId,
    { status },
    { new: true }
  );
  if (!updatedPayment) throw new ApiError(404, "Payment not found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPayment,
        "Payment status updated successfully"
      )
    );
});

// Delete a payment (Admin only)
const deletePayment = AsyncHandler(async (req, res) => {
  const paymentId = req.params.id;
  const deletedPayment = await Payment.findByIdAndDelete(paymentId);
  if (!deletedPayment) throw new ApiError(404, "Payment not found");

  res
    .status(200)
    .json(new ApiResponse(200, deletePayment, "Payment deleted successfully"));
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const options = {
    amount, // amount in paise (₹1 = 100)
    currency: "INR",
    receipt: "receipt_" + new Date().getTime(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyPayment = AsyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
  } = req.body;

  const userId = req.user?._id;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !amount
  ) {
    throw new ApiError(400, "Missing required fields for verification");
  }

  // ✅ 1. Signature Verification
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }


  // ✅ 2. Create Payment with transactionId reference
  const payment = await Payment.create({
    userId,
    paymentMethod: "Razorpay",
    amount: amount,
    status: "success",
    type: "Deposit",
  });

  // ✅ 3. Update User Balance
  const userUpdated = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { walletBalance: amount },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payment, userUpdated },
        "Payment verified, balance updated"
      )
    );
});

const paymentVerification = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({
      status: "success",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } else {
    res.status(400).json({ status: "failure" });
  }
};

export {
  createWithdrawRequest,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  deletePayment,
  createOrder,
  verifyPayment,
  paymentVerification,
};
