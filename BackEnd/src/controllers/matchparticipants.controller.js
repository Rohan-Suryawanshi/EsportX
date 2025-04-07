import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Match } from "../models/matches.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { MatchParticipant } from "../models/matchparticipants.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerParticipant = AsyncHandler(async (req, res) => {
  const { matchId, gameUsername, gameUID } = req.body;

  if (!matchId || !gameUsername || !gameUID) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const userId = req.user?._id;

  const match = await Match.findById(matchId);
  if (!match) throw new ApiError(404, "Match Not Found");

  if (match.totalPlayersJoined >= match.maxPlayers) {
    throw new ApiError(400, "Match is full");
  }

  const userExists = await User.exists({ _id: userId });
  if (!userExists) throw new ApiError(404, "User Not Found");

  const existingParticipant = await MatchParticipant.findOne({
    matchId,
    userId,
  });
  if (existingParticipant) {
    throw new ApiError(400, "Participant Already Registered");
  }

  const participant = new MatchParticipant({
    matchId,
    userId,
    gameUsername,
    gameUID,
  });
  const registeredParticipant = await participant.save();
  if (!registeredParticipant) {
    throw new ApiError(500, "Failed To Register Participant");
  }

  // Increase totalPlayersJoined
  match.totalPlayersJoined += 1;
  await match.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        registeredParticipant,
        "Participant Registered Successfully"
      )
    );
});


const getMatchParticipants = AsyncHandler(async (req, res) => {
  const { matchId } = req.params;
  if (!matchId) {
    throw new ApiError(400, "Match Id Is Required");
  }
  const matchExists = await Match.exists({ _id: matchId });
  if (!matchExists) {
    throw new ApiError(404, "Match Not Found");
  }
  const participants = await MatchParticipant.find({ matchId }).populate(
    "userId",
    "name email"
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, participants, "Participants Fetched Successfully")
    );
});

const getParticipantById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Participant ID is required");
  }
  const participant = await MatchParticipant.findById(id).populate(
    "userId",
    "name email"
  );

  if (!participant) {
    throw new ApiError(404, "Participant Not Found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, participant, "Participant Fetched Successfully")
    );
});

const removeParticipant = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Participant ID is required");
  }

  const participant = await MatchParticipant.findById(id);
  if (!participant) {
    throw new ApiError(404, "Participant Not Found");
  }

  const match = await Match.findById(participant.matchId);
  if (!match) {
    throw new ApiError(404, "Match Not Found");
  }

  // Remove participant
  await MatchParticipant.findByIdAndDelete(id);

  // Decrease totalPlayersJoined if it's greater than 0
  if (match.totalPlayersJoined > 0) {
    match.totalPlayersJoined -= 1;
    await match.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Participant Removed Successfully"));
});


const updateParticipantStats = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { kills } = req.body;
  if (!id) {
    throw new ApiError(400, "Participant ID is required");
  }
  if (kills === undefined || typeof kills !== "number" || kills < 0) {
    throw new ApiError(400, "Valid kills value is required");
  }

 const participant = await MatchParticipant.findById(id).populate(
   "matchId",
   "perKill gameId"
 );
 if (!participant) throw new ApiError(404, "Participant Not Found");

  participant.kills = kills;
  await participant.save();
  await updateLeaderboard(participant.matchId._id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        participant,
        "Participant Stats Updated Successfully"
      )
    );
});
const updateBulkParticipantStats = AsyncHandler(async (req, res) => {
  const { matchId, participants } = req.body;

  if (!matchId) throw new ApiError(400, "Match ID is required");
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ApiError(400, "Participants array is required");
  }

  // Fetch Match Details to get `perKill` value
  const match = await Match.findById(matchId).select("perKill gameId");
  if (!match) throw new ApiError(404, "Match Not Found");

  // Prepare bulk updates for match participants
  const bulkParticipantUpdates = participants
    .map(({ id, kills }) => {
      if (!id || typeof kills !== "number" || kills < 0) return null;
      return {
        updateOne: {
          filter: { _id: id },
          update: { $set: { kills, earnings: kills * match.perKill } },
        },
      };
    })
    .filter(Boolean);

  if (bulkParticipantUpdates.length === 0) {
    throw new ApiError(400, "No valid participants found for update");
  }

  await MatchParticipant.bulkWrite(bulkParticipantUpdates);

  // Trigger Leaderboard Update for the Match
  await updateLeaderboard(matchId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Match participant stats and leaderboard updated successfully"
      )
    );
});

export {
  registerParticipant,
  getMatchParticipants,
  getParticipantById,
  removeParticipant,
  updateParticipantStats,
  updateBulkParticipantStats,
};
