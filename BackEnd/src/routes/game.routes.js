import { Router } from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGame,
  updateGame,
} from "../controllers/game.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/:id", getGame);
router.post("/",upload.single('image'), verifyJWT,checkAdmin, createGame);
router.delete("/:id",verifyJWT,checkAdmin, deleteGame);
router.put("/:id", checkAdmin,upload.single("image"), updateGame);
router.get("/",getAllGames);

export default router;
