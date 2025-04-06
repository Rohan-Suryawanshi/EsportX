import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "UPI", "PayPal", "Credit Card"],
      required: true,
    },
    upiId: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid UPI ID!`,
      },
    },
    type: {
      type: String,
      enum: ["Deposit", "WITHDRAW", "PRIZE"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
