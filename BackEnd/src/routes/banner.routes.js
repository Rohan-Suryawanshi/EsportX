import { Router } from "express";
import {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
} from "../controllers/banner.controller.js";
import {upload} from "../middlewares/multer.middleware.js"; // Middleware for image upload

const router = Router();

router.post("/", upload.single("bannerImage"), createBanner); 
router.get("/", getAllBanners);
router.get("/:id", getBanner); 
router.put("/:id", upload.single("bannerImage"), updateBanner); 
router.delete("/:id", deleteBanner); 

export default router;
