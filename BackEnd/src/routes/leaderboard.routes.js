import express from "express";
import {
  getLeaderboard,
  getUserRank,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

// Route to get the top 20 leaderboard for a game
router.get("/", getLeaderboard);

//Route to get a user's rank in a specific game
router.get("/user-rank", getUserRank);

export default router;
