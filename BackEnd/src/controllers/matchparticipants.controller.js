import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Match } from "../models/matches.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { MatchParticipant } from "../models/matchparticipants.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerParticipant = AsyncHandler(async (req, res) => {
  const { matchId, userId, gameUsername, gameUID } = req.body;

  if (!matchId || !userId || !gameUsername || !gameUID) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const matchExists = await Match.exists({ _id: matchId });
  if (!matchExists) throw new ApiError(404, "Match Not Found");

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
  const participant = await MatchParticipant.findByIdAndDelete(id);
  if (!participant) {
    throw new ApiError(404, "Participant Not Found");
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

  const participant = await MatchParticipant.findById(id);
  if (!participant) throw new ApiError(404, "Participant Not Found");

  participant.kills = kills;
  await participant.save();

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
  const { participants } = req.body;
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ApiError(400, "Participants array is required");
  }

  const bulkOperations = participants
    .map(({ id, kills }) => {
      if (!id || typeof kills !== "number" || kills < 0) {
        return null; // Skip invalid entries
      }
      return {
        updateOne: {
          filter: { _id: id },
          update: { $set: { kills } },
        },
      };
    })
    .filter(Boolean); // Remove null values (invalid entries)

  if (bulkOperations.length === 0) {
    throw new ApiError(400, "No valid participants found for update");
  }

  const result = await MatchParticipant.bulkWrite(bulkOperations);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Bulk participant stats updated successfully"
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
