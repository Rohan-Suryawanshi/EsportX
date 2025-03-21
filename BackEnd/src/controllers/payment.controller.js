import { Payment } from "../models/payment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

// Create a new payment
const createPayment = AsyncHandler(async (req, res) => {
  const { transactionId, paymentMethod, amount } = req.body;
  const userId = req.user?._id; // Assuming user is authenticated

  if (!paymentMethod) throw new ApiError(400, "Payment method is required");
  if (!amount) throw new ApiError(400, "Amount is required");

  const newPayment = new Payment({
    userId,
    transactionId,
    paymentMethod,
    amount,
  });

  const savedPayment = await newPayment.save();
  res
    .status(201)
    .json(new ApiResponse(201, savedPayment, "Payment created successfully"));
});

// Get all payments (Admin only)
const getAllPayments = AsyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") throw new ApiError(403, "Access denied");

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

  const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, payments, "User payments fetched successfully"));
});

// Update payment status (Admin only)
const updatePaymentStatus = AsyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") throw new ApiError(403, "Access denied");

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
  if (req.user?.role !== "Admin") throw new ApiError(403, "Access denied");

  const paymentId = req.params.id;
  const deletedPayment = await Payment.findByIdAndDelete(paymentId);
  if (!deletedPayment) throw new ApiError(404, "Payment not found");

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Payment deleted successfully"));
});

export {
  createPayment,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  deletePayment,
};
