import express from "express";
import {
  registerParticipant,
  getMatchParticipants,
  getParticipantById,
  removeParticipant,
  updateParticipantStats,
  updateBulkParticipantStats,
} from "../controllers/matchParticipant.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";

const router = express.Router();

// Register a participant for a match
router.post("/register",verifyJWT, registerParticipant);

// Get all participants for a match
router.get("/match/:matchId",verifyJWT, getMatchParticipants);

//  Get a single participant by ID
router.get("/:id",verifyJWT,checkAdmin, getParticipantById);

//  Remove a participant from a match
router.delete("/:id",verifyJWT,checkAdmin, removeParticipant);

// Update a single participant's kills (and update leaderboard)
router.put("/:id/stats", verifyJWT, checkAdmin, updateParticipantStats);

// Bulk update participants' kills for a match (and update leaderboard)
router.put(
  "/match/:matchId/stats",
  verifyJWT,
  checkAdmin,
  updateBulkParticipantStats
);

export default router;
