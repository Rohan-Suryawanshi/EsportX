import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Match } from "../models/matches.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createMatch = AsyncHandler(async (req, res) => {
  const {
    gameId,
    startTime,
    entryFee,
    perKill,
    type,
    map,
    maxPlayers,
    levelCriteria,
  } = req.body;

  if (
    [
      gameId,
      startTime,
      entryFee,
      perKill,
      type,
      map,
      maxPlayers,
      levelCriteria,
    ].some((value) => value === undefined || value === null || value === "")
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const status = req.body.status || "UPCOMING";

  const newMatch = new Match({
    gameId,
    startTime,
    entryFee,
    perKill,
    type,
    map,
    maxPlayers,
    levelCriteria,
    status,
  });

  const createdMatch = await newMatch.save();

  if (!createdMatch) {
    throw new ApiError(500, "Failed To Create Match");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdMatch, "Match Created Successfully"));
});


const getAllMatches = AsyncHandler(async (req, res) => {
  const { status, type, map } = req.query;
  let filter = {};
  if (req.user?.role !== "Admin") {
    filter.userId = req.user?._id;
  }
  if (status) {
    filter.status = status;
  }
  if (type) {
    filter.type = type;
  }
  if (map) {
    filter.map = map;
  }

  const matches = await Match.find(filter)
    .populate("gameId")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches Fetch Successfully"));
});

const getMatchById = AsyncHandler(async (req, res) => {
  const matchId = req.params.id;
  if (!matchId) {
    throw new ApiError(400, "Match ID is required");
  }
  const match = await Match.findById(matchId).populate("gameId");
  if (!match) {
    throw new ApiError(404, "Match Not Found");
  }
  res.status(200).json(new ApiResponse(200, match, "Match Fetch Successfully"));
});

const updateMatchDetails = AsyncHandler(async (req, res) => {
  const matchId = req.params.id;
  if (!matchId) {
    throw new ApiError(400, "Match Id is Required");
  }
  const {
    startTime,
    entryFee,
    perKill,
    type,
    map,
    maxPlayers,
    levelCriteria,
  } = req.body;

  // if (gameId && typeof gameId !== "string") {
  //   throw new ApiError(400, "Invalid gameId");
  // }

  if (startTime && isNaN(new Date(startTime))) {
    throw new ApiError(400, "Invalid startTime");
  }

  if (entryFee !== undefined && entryFee < 0) {
    throw new ApiError(400, "Entry fee must be positive");
  }

  if (perKill !== undefined && perKill < 0) {
    throw new ApiError(400, "Per kill value must be positive");
  }

  if (type && !["Solo", "Duo", "Squad"].includes(type)) {
    throw new ApiError(400, "Invalid type");
  }

  if (map && typeof map !== "string") {
    throw new ApiError(400, "Invalid map name");
  }

  if (maxPlayers !== undefined && maxPlayers < 0) {
    throw new ApiError(400, "Max players must be positive");
  }

  if (levelCriteria !== undefined && levelCriteria < 0) {
    throw new ApiError(400, "Level criteria must be positive");
  }

  const updatedMatch = await Match.findByIdAndUpdate(
    matchId,
    {
      $set: {
        gameId,
        startTime,
        entryFee,
        perKill,
        type,
        map,
        maxPlayers,
        levelCriteria,
      },
    },
    { new: true }
  ).populate("gameId");
  if (!updatedMatch) {
    throw new ApiError(404, "Match Not Found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedMatch, "Match Updated Successfully"));
});

const updateStatusOfMatch = AsyncHandler(async (req, res) => {
  const matchId = req.params.id;
  if (!matchId) {
    throw new ApiError(400, "Match Id is Required");
  }
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Status is required");
  }
  if (!["UPCOMING", "ONGOING", "COMPLETE"].includes(status)) {
    throw new ApiError(400, "Invalid Status");
  }
  const updatedMatch = await Match.findByIdAndUpdate(
    matchId,
    {
      $set: {
        status,
      },
    },
    { new: true }
  ).populate("gameId");

  res
    .status(200)
    .json(new ApiResponse(200, updatedMatch, "Match Updated Successfully"));
});

const deleteMatch = AsyncHandler(async (req, res) => {

  const matchId=req.params.id;
  if(!matchId)
  {
    throw new ApiError(400,"Enter the Match ID");
  }
  const match = await Match.findByIdAndDelete(matchId);
  if (!match) throw new ApiError(404, "Match not found");

  res.status(200).json(new ApiResponse(200, {}, "Match deleted successfully"));
});

const getSpecificGameMatches = AsyncHandler(async (req, res) => {
  const gameId = req.params.id;

  if (!gameId) {
    throw new ApiError(400, "Enter the Game ID");
  }

  const matches = await Match.find({ gameId });

  res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches fetched successfully"));
});



export {
  createMatch,
  getAllMatches,
  getMatchById,
  updateStatusOfMatch,
  updateMatchDetails,
  deleteMatch,
  getSpecificGameMatches,
};
