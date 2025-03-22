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
const router = Router();

router.get("/:id", getGame);
router.post("/create",checkAdmin,upload.single('image'), createGame);
router.delete("/:id",checkAdmin, deleteGame);
router.put("/:id", checkAdmin,upload.single("image"), updateGame);
router.get("/",getAllGames);

export default router;
