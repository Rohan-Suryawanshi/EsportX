import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Banner } from "../models/banners.model.js";
import fs from "fs";
import { uploadToCloudinary, destroyImage } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Utility to delete local file
const deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
      else console.log("Local file deleted:", filePath);
    });
  }
};

// ✅ Create a Banner
const createBanner = AsyncHandler(async (req, res) => {
  const { title, link = "", isActive = true } = req.body; // ✅ Default link to empty string, isActive to true

  const bannerImagePath = req?.file?.path || "";
  if (!bannerImagePath) throw new ApiError(400, "Image is required");

  if (!title) {
    deleteLocalFile(bannerImagePath);
    throw new ApiError(400, "Title is required");
  }

  // Upload to Cloudinary
  const image = await uploadToCloudinary(bannerImagePath);
  if (!image?.url) throw new ApiError(500, "Failed to upload image");

  // Create banner
  const banner = await Banner.create({
    title,
    imageUrl: image.url,
    link,
    isActive,
  });

  res
    .status(201)
    .json(new ApiResponse(201, banner, "Banner created successfully"));
});

const updateBannerDetails = AsyncHandler(async (req, res) => {
  const bannerId = req.params.id;
  let { title, link, isActive } = req.body;
  if (!bannerId) {
    throw new ApiError(400, "Banner ID is required");
  }
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  link = link ?? "";
  isActive = isActive ?? true;
  const updatedBanner=await Banner.findByIdAndUpdate(
    bannerId,
    {
      $set:{
        title,
        link,
        isActive,
      }
    },{
      new:true
    }
  )
  res
    .status(200)
    .json(new ApiResponse(200, updatedBanner, "Banner Updated Successfully"));
});

const updateBannerImage=AsyncHandler(async (req,res)=>{
  const bannerId = req.params.id;
  if (!bannerId) throw new ApiError(400, "Banner ID is required");
  let bannerLocalImagePath=req?.file?.path;
  if (!bannerLocalImagePath) throw new ApiError(400, "Image is required");

  const uploadedBanner=await uploadToCloudinary(bannerLocalImagePath);
  console.log(uploadedBanner);
  if(!uploadedBanner?.url)
  {
    throw new ApiError(500, "Failed to upload banner image");
  }
  const updatedBanner = await Banner.findByIdAndUpdate(
    bannerId,
    {
      $set: {
        imageUrl: uploadedBanner.url,
      },
    },
    {
      new: true,
    }
  );
  res
  .status(200)
  .json(new ApiResponse(200, updatedBanner, "Banner Image Updated Successfully"));
  
})

const getBanner = AsyncHandler(async (req, res) => {
  const bannerId = req.params.id;
  if (!bannerId) throw new ApiError(400, "Banner ID is required");

  const banner = await Banner.findById(bannerId);
  if (!banner) throw new ApiError(404, "Banner not found");

  res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner retrieved successfully"));
});

const getAllBanners = AsyncHandler(async (req, res) => {
  const banners = await Banner.find();
  res
    .status(200)
    .json(new ApiResponse(200, banners, "Banners retrieved successfully"));
});

const deleteBanner = AsyncHandler(async (req, res) => {
  const bannerId = req.params.id;
  if (!bannerId) throw new ApiError(400, "Banner ID is required");

  const banner = await Banner.findById(bannerId);
  if (!banner) throw new ApiError(404, "Banner not found");

  if (banner.imageUrl) {
    await destroyImage(banner.imageUrl);
  }

  await banner.deleteOne();

  res
    .status(200)
    .json(
      new ApiResponse(200, { _id: bannerId }, "Banner deleted successfully")
    );
});

export {
  createBanner,
  getBanner,
  getAllBanners,
  deleteBanner,
  updateBannerDetails,
  updateBannerImage,
};
