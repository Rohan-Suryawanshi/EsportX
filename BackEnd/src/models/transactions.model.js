import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["Deposit", "Withdrawal", "Prize"],
      required: true,
    },
    upiId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid UPI ID!`
        }
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
