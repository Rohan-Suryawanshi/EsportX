import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";
import {
  createMatch,
  getAllMatches,
  getMatchById,
  deleteMatch,
  updateMatchDetails,
  updateStatusOfMatch,
  getSpecificGameMatches,
} from "../controllers/match.controller.js";

const router = Router();

router.post("/", verifyJWT, createMatch); // Admin only
// router.post("/", createMatch);
router.get("/all-matches", getAllMatches);
router.get("/",verifyJWT, getAllMatches);
router.get("/:id", getMatchById);
router.put("/update/:id", verifyJWT, updateMatchDetails); // Admin only
router.patch("/status/:id", verifyJWT, updateStatusOfMatch); // Admin only
router.delete("/delete/:id", verifyJWT, deleteMatch); // Admin only
router.get('/games/:id',getSpecificGameMatches);

export default router;
