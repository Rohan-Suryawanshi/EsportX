import { Router } from "express";
import {
  createBanner,
  getBanner,
  deleteBanner,
  getAllBanners,
  updateBannerImage,
  updateBannerDetails,
} from "../controllers/banner.controller.js";
import {upload} from "../middlewares/multer.middleware.js"; // Middleware for image upload

const router = Router();

router.post("/", upload.single("bannerImage"), createBanner); 
router.get("/", getAllBanners);
router.get("/:id", getBanner); 
router.put("/update-image/:id", upload.single("bannerImage"),updateBannerImage); 
router.put("/update-details/:id",updateBannerDetails)
router.delete("/:id", deleteBanner); 

export default router;
