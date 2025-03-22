import mongoose from "mongoose";

const matchParticipantSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameUsername: {
      type: String,
      required: true,
    },
    gameUID: {
      type: String,
      required: true,
    },
    isWinner: { type: Boolean, default: false },
    kills: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);
matchParticipantSchema.pre("save", async function (next) {
  if (!this.isModified("kills")) return next();

  const match = await mongoose.model("Match").findById(this.matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  this.earnings = this.kills * match.perKill;
  next();
});

export const MatchParticipant = mongoose.model(
  "MatchParticipant",
  matchParticipantSchema
);
