import { Transaction } from "../models/transactions.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { AsyncHandler } from "../utils/AsyncHandler";

const createTransaction = AsyncHandler(async (req, res) => {
  const { amount, type } = req.body;
  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }
  if (!type) {
    throw new ApiError(400, "Type is required");
  }
  const userId = req.user?._id;
  const newTransaction = new Transaction({
    userId,
    amount,
    type,
  });
  const savedTransaction = await newTransaction.save();
  req
    .status(200)
    .json(
      new ApiResponse(200, savedTransaction, "Transaction created successfully")
    );
});

const getAllTransactions = AsyncHandler(async (req, res) => {
  const {status,type}=req.query;
  let filter={};
  if (req.users?.role !== "Admin") {
    filter.userId= req.user?._id;
  }
  if (status) {
    filter.status = status;
  }
  if (type) {
    filter.type = type;
  }
  const transactions=await Transaction.find(filter).populate("userId","username email").sort({createdAt:-1});
  res.status(200).json(new ApiResponse(200, transactions, "Transactions fetched successfully"));
});

export { createTransaction, getAllTransactions };
