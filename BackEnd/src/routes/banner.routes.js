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
import { checkAdmin } from "../middlewares/checkAdmin.middleware.js";

const router = Router();

router.post("/",checkAdmin, upload.single("bannerImage"), createBanner); 
router.get("/", getAllBanners);
router.get("/:id",getBanner); 
router.put(
  "/update-image/:id",
  checkAdmin,
  upload.single("bannerImage"),
  updateBannerImage
); 
router.put("/update-details/:id", checkAdmin,updateBannerDetails);
router.delete("/:id",checkAdmin, deleteBanner); 

export default router;
