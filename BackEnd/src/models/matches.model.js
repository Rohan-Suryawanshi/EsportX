import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const matchSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    startTime: { type: Date, required: true },
    entryFee: { type: Number, required: true, default: 0 },
    perKill: { type: Number, required: true, default: 0 },
    type: { type: String, enum: ["Solo", "Duo", "Squad"], required: true },
    map: { type: String, required: true },
    maxPlayers: { type: Number, required: true, default: 0 },
    totalPlayersJoined: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETE"],
      default: "UPCOMING",
    },
    levelCriteria: { type: Number, default: 0, required: true },
    roomId: { type: String, default: "Empty" },
    roomPassword: { type: String, default: "Empty" },
  },
  { timestamps: true }
);

matchSchema.plugin(mongooseAggregatePaginate);
export const Match = mongoose.model("Match", matchSchema);
