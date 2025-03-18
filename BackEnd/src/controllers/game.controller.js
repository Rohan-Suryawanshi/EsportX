import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Game } from "../models/games.model.js";
import fs from "fs";
import { destroyImage, uploadToCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const deleteLocalFile = (fileName) => {
  if (fs.existsSync(fileName)) {
    fs.unlink(fileName, (err) => {
      if (err) console.error("Error deleting local file:", err);
      else console.log("Local file deleted:", fileName);
    });
  }
};
const createGame = AsyncHandler(async (req, res) => {
  const { name, status } = req.body;

  const gameImagePath = req?.file?.path || "";
  if (!gameImagePath) {
    throw new ApiError(400, "Image Must Be Required");
  }

  if (!name) {
    deleteLocalFile(gameImagePath);
    throw new ApiError(400, "Game Name Must Be Provided");
  }
  if (!status) {
    deleteLocalFile(gameImagePath);
    throw new ApiError(400, "Status Must Be Provided");
  }
  const image = await uploadToCloudinary(gameImagePath);
  if (!image?.url) {
    throw new ApiError(500, "Failed to Upload Image to Cloudinary");
  }

  const game = await Game.create({
    name,
    status,
    image: image.url,
  });

  res.status(201).json(new ApiResponse(201, game, "Game Created Successfully"));
});

const deleteGame = AsyncHandler(async (req, res) => {
  const gameId = req.params.id;

  if (!gameId) {
    throw new ApiError(400, "Game ID is required");
  }

  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game Not Found");
  }
  if (game.image) {
    await destroyImage(game.image);
  }

  await game.deleteOne();
  let gameResponse = {
    _id: game._id,
    username: game.name,
    status: game.status,
  };

  
  res.status(200).send(new ApiResponse(200, gameResponse, "Game Deleted Successfully"));
});

const getGame = AsyncHandler(async (req, res) => {
  const gameId = req.params.id;
  if (!gameId) {
    throw new ApiError(400, "Game ID is required");
  }
  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game Not Found");
  }
  res
    .status(200)
    .send(new ApiResponse(200, game, "Game Retrieved Successfully"));
});
const updateGame = AsyncHandler(async (req, res) => {
  const gameId = req.params.id;
  if (!gameId) {
    throw new ApiError(400, "Game ID is required");
  }
  const { name, status } = req.body;
  let isUpdated = false;
  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game Not Found");
  }
  if (name && game.name !== name) {
    game.name = name;
    isUpdated = true;
  }
  if (status && game.status !== status) {
    game.status = status;
    isUpdated = true;
  }

  let gameImagePath = req?.file?.path || "";
  if (gameImagePath) {
    const uploadedGameImage = await uploadToCloudinary(gameImagePath);
    if (!uploadedGameImage?.url) {
      throw new ApiError(500, "Failed to upload game image");
    }
    if (game.image) {
      await destroyImage(game.image);
    }
    game.image = uploadedGameImage.url;
    isUpdated = true;
  }
  if (isUpdated) {
    await game.save();
    return res
      .status(200)
      .json(new ApiResponse(200, game, "Game Updated Successfully"));
  }

  res.status(200).send(new ApiResponse(200, game, "No changes were made"));
});
const getAllGames = AsyncHandler(async (req, res) => {
  const games = await Game.find();
  res
    .status(200)
    .json(new ApiResponse(200, games, "Games retrieved successfully"));
});
export { createGame, deleteGame, getGame, updateGame,getAllGames };
