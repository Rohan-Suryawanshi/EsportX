import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Banner } from "../models/baners.model.js";
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

// ✅ Update a Banner
const updateBanner = AsyncHandler(async (req, res) => {
  const bannerId = req.params.id;
  if (!bannerId) throw new ApiError(400, "Banner ID is required");

  const { title, link, isActive } = req.body;
  let isUpdated = false;

  const banner = await Banner.findById(bannerId);
  if (!banner) throw new ApiError(404, "Banner not found");

  if (title && banner.title !== title) {
    banner.title = title;
    isUpdated = true;
  }

  if (link !== undefined && banner.link !== link) {
    banner.link = link;
    isUpdated = true;
  }

  if (typeof isActive === "boolean" && banner.isActive !== isActive) {
    banner.isActive = isActive;
    isUpdated = true;
  }

  let bannerImagePath = req?.file?.path || "";
  if (bannerImagePath) {
    const uploadedBannerImage = await uploadToCloudinary(bannerImagePath);
    if (!uploadedBannerImage?.url)
      throw new ApiError(500, "Failed to upload banner image");

    if (banner.imageUrl) {
      await destroyImage(banner.imageUrl);
    }

    banner.imageUrl = uploadedBannerImage.url;
    isUpdated = true;
  }

  if (isUpdated) {
    await banner.save();
    return res
      .status(200)
      .json(new ApiResponse(200, banner, "Banner updated successfully"));
  }

  res.status(200).send(new ApiResponse(200, banner, "No changes were made"));
});

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

export { createBanner, updateBanner, getBanner, getAllBanners, deleteBanner };
