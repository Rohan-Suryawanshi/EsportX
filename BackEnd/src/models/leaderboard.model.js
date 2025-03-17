import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalKills: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number },
  },
  { timestamps: true }
);

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
