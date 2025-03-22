import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { checkAdmin } from "../middlewares/checkAdmin.middleware";

const router = Router();

router.post("/", verifyJWT,checkAdmin, createMatch); // Admin only
router.get("/", getAllMatches);
router.get("/:id", getMatchById);
router.put("/:id", verifyJWT,checkAdmin, updateMatch); // Admin only
router.patch("/:id/status", verifyJWT,checkAdmin, updateMatchStatus); // Admin only
router.delete("/:id", verifyJWT,checkAdmin, deleteMatch); // Admin only

export default router;
