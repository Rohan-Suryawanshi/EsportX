import { Router } from "express";
import {
  createWithdrawRequest,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  deletePayment,
  createOrder,
  verifyPayment,
  paymentVerification,
} from "../controllers/payment.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";

const router = Router();

// Create a new payment (Authenticated User)
router.post("/", verifyJWT, createWithdrawRequest);

// Get all payments (Only authenticated users)
router.get("/", verifyJWT,checkAdmin, getAllPayments);



// Get all payments for the logged-in user
router.get("/user",verifyJWT, getUserPayments);

// Get a single payment by ID (Authenticated User)
router.get("/:id", verifyJWT, getPaymentById);

// Update payment status (Authenticated User)
router.put("/:id", verifyJWT,checkAdmin,updatePaymentStatus);

// Delete a payment (Authenticated User)
router.delete("/:id", verifyJWT,checkAdmin, deletePayment);

router.post("/create-order",verifyJWT, createOrder);
router.post("/verify-payment",verifyJWT,verifyPayment);
router.post("/payment-verification",verifyJWT, paymentVerification);

export default router;
