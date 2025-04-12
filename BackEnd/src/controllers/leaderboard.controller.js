import { Leaderboard } from "../models/leaderboard.model.js";
import { Match } from "../models/matches.model.js";
import { MatchParticipant } from "../models/matchparticipants.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const getLeaderboard = AsyncHandler(async (req, res) => {
  const { gameId } = req.query;
  if (!gameId) throw new ApiError(400, "Game ID is required");

  const leaderboard = await Leaderboard.find({ gameId })
    .sort({ earnings: -1 })
    .select("userId totalKills earnings rank")
    .populate("userId", "username avatar")
    .limit(20);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        leaderboard,
        "Top 20 leaderboard fetched successfully"
      )
    );
});

const updateLeaderboard = AsyncHandler(async (matchId) => {
  const match = await Match.findById(matchId).select("gameId");
  if (!match) throw new ApiError(404, "Match Not Found");

  const participants = await MatchParticipant.find({ matchId }).select(
    "userId kills earnings"
  );

  // 🔹 Bulk update total kills & earnings
  const bulkUpdates = participants.map(({ userId, kills, earnings }) => ({
    updateOne: {
      filter: { userId, gameId: match.gameId },
      update: { $inc: { totalKills: kills, earnings } },
      upsert: true,
    },
  }));
  await Leaderboard.bulkWrite(bulkUpdates);

  // ✅ Scalable Rank Recalculation (Bulk Update)
  const leaderboard = await Leaderboard.find({ gameId: match.gameId })
    .sort({ earnings: -1 })
    .select("_id"); // Only fetch `_id` to avoid large payload

  const bulkRankUpdates = leaderboard.map((entry, index) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { $set: { rank: index + 1 } },
    },
  }));
  await Leaderboard.bulkWrite(bulkRankUpdates);

  return true;
});

const getUserRank = AsyncHandler(async (req, res) => {
  const { userId, gameId } = req.query;
  if (!userId || !gameId)
    throw new ApiError(400, "User ID and Game ID are required");

  const userRank = await Leaderboard.findOne({ userId, gameId }).select(
    "totalKills earnings rank"
  );
  if (!userRank) throw new ApiError(404, "User not found in leaderboard");

  res
    .status(200)
    .json(new ApiResponse(200, userRank, "User rank fetched successfully"));
});

export { getLeaderboard, updateLeaderboard, getUserRank };
