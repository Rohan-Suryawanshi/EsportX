import { Transaction } from "../models/transactions.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createTransaction = AsyncHandler(async (req, res) => {
  const { amount, type } = req.body;

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  if (!type || !["DEPOSIT", "WITHDRAW"].includes(type)) {
    throw new ApiError(400, "Transaction type must be DEPOSIT or WITHDRAW");
  }

  const userId = req.user?._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newTransaction = new Transaction({
    userId,
    amount,
    type,
  });

  const savedTransaction = await newTransaction.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, savedTransaction, "Transaction created successfully")
    );
});


const getAllTransactions = AsyncHandler(async (req, res) => {
  const { status, type } = req.query;
  let filter = {};
  if (req.user?.role !== "Admin") {
    filter.userId = req.user?._id;
  }
  if (status) {
    filter.status = status;
  }
  if (type) {
    filter.type = type;
  }
  const transactions = await Transaction.find(filter)
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully")
    );
});

const getTransactionById = AsyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const transaction = await Transaction.findById(transactionId).populate(
    "userId",
    "username email"
  );
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, transaction, "Transaction fetched successfully")
    );
});

const updateTransactionStatus = AsyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const { status } = req.body;
  if (!transactionId) {
    throw new ApiError(400, "Transaction ID is required");
  }
  if (!status) {
    throw new ApiError(400, "Status is required");
  }
  const transaction = await Transaction.findByIdAndUpdate(
    transactionId,
    { status },
    { new: true }
  ).populate("userId", "username email");
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transaction,
        "Transaction status updated successfully"
      )
    );
});

const deleteTransaction = AsyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  if (!transactionId) {
    throw new ApiError(400, "Transaction ID is required");
  }
  const transaction = await Transaction.findByIdAndDelete(transactionId);
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Transaction deleted successfully"));
});

const getUserTransactions = AsyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const transactions = await Transaction.find({ userId })
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transactions,
        "User transactions fetched successfully"
      )
    );
});

const getPendingTransactions = AsyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ status: "pending" })
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transactions,
        "Pending transactions fetched successfully"
      )
    );
});
const getTransactionSummary = AsyncHandler(async (req, res) => {
  const summary = await Transaction.aggregate([
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res
    .status(200)
    .json(
      new ApiResponse(200, summary, "Transaction summary fetched successfully")
    );
});

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus,
  deleteTransaction,
  getUserTransactions,
  getPendingTransactions,
  getTransactionSummary,
};
