import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getPendingTransactions,
  getTransactionById,
  getTransactionSummary,
  getUserTransactions,
  updateTransactionStatus,
} from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransactionStatus);

router.get("/pending-transaction", getPendingTransactions);
router.get("/transaction-summary", getTransactionSummary);
router.get("/user/:id", getUserTransactions);
router.get("/:id", getTransactionById);
router.get("/", getAllTransactions);

export default router;
