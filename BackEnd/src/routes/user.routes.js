import { Router } from "express";
import {
  changeCurrentUserPassword,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatarImage,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// 🔹 Public Routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// 🔹 Authenticated Routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.put("/account-details", verifyJWT, updateAccountDetails);
router.put("/change-password", verifyJWT, changeCurrentUserPassword);
router.put("/avatar", verifyJWT, upload.single("avatar"), updateAvatarImage);

// 🔹 Admin Routes
router.get("/", verifyJWT, getAllUsers);
router.delete("/:id", verifyJWT, deleteUser);
router.get("/:id", verifyJWT, getUser);
router.put("/:id", verifyJWT, upload.single("avatar"), updateUser);

export default router;
