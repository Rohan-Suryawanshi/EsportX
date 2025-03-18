import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// router.route("/register").get(registerUser);
router.post("/register", upload.single("avatar"), registerUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.get("/", getAllUsers);
export default router;
