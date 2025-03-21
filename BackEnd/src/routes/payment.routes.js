import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  deletePayment,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js"; // Ensure authentication

const router = Router();

// 🔹 Create a new payment (Authenticated User)
router.post("/", verifyJWT, createPayment);

// 🔹 Get all payments (Only authenticated users)
router.get("/", verifyJWT, getAllPayments);

// 🔹 Get a single payment by ID (Authenticated User)
router.get("/:id", verifyJWT, getPaymentById);

// 🔹 Get all payments for the logged-in user
router.get("/user", verifyJWT, getUserPayments);

// 🔹 Update payment status (Authenticated User)
router.put("/:id", verifyJWT, updatePaymentStatus);

// 🔹 Delete a payment (Authenticated User)
router.delete("/:id", verifyJWT, deletePayment);

export default router;
