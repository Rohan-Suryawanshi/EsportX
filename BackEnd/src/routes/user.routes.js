import { Router } from "express";
import {
  changeCurrentUserPassword,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUser,
  getUserJoinedMatches,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatarImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";

const router = Router();

// 🔹 Authenticated Routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/joined-matches", verifyJWT, getUserJoinedMatches);
router.get("/current-user", verifyJWT, getCurrentUser);
router.put("/change-password", verifyJWT, changeCurrentUserPassword);
router.put("/update-image", verifyJWT, upload.single("avatar"), updateAvatarImage);
router.put("/update-details", verifyJWT, updateAccountDetails);



// 🔹 Admin Routes
router.get("/", verifyJWT, getAllUsers);
router.delete("/:id", verifyJWT, deleteUser);
router.get("/:id", verifyJWT, getUser);

export default router;
