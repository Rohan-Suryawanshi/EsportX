import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalKills: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, index: true },
  },
  { timestamps: true }
);

leaderboardSchema.index({ gameId: 1, totalPoints: -1 });

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
