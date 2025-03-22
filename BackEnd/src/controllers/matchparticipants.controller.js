import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Match } from "../models/matches.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {MatchParticipant} from "../models/matchparticipants.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerParticipant = AsyncHandler(async (req, res) => {
  const { matchId, userId, gameUsername, gameUID } = req.body;

  if(!matchId || !userId || !gameUsername || !gameUID){
    throw new ApiError(400, "All Fields Are Required");
  }

  const match = await Match.findById(matchId);
  if (!match) {
    throw new ApiError(404, "Match Not Found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const participant=new MatchParticipant({
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
    .status(200)
    .json(new ApiResponse(200, registeredParticipant, "Participant Registered Successfully"));

});

export { registerParticipant };
