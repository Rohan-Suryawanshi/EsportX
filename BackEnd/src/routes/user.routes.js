import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

// router.route("/register").get(registerUser);
router.post("/register", upload.single("avatar"), registerUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.get("/", getAllUsers);
router.post("/login",loginUser);
router.post("/logout",verifyJWT,logoutUser);
export default router;
