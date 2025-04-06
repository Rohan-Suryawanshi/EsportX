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
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/",verifyJWT, createTransaction);
router.delete("/:id",checkAdmin, deleteTransaction);
router.put("/:id", checkAdmin,updateTransactionStatus);

router.get("/pending-transaction",checkAdmin, getPendingTransactions);
router.get("/transaction-summary",checkAdmin, getTransactionSummary);
router.get("/user/:id",checkAdmin, getUserTransactions);
router.get("/:id",checkAdmin, getTransactionById);
router.get("/",getAllTransactions);

export default router;
