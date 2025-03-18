import mongoose from "mongoose";
const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Cloudinary image URL
    link: { type: String}, // Clickable link for gaming banner
    isActive: { type: Boolean, default: true }, // Banner status
  },
  { timestamps: true }
);

export const Banner = mongoose.model("Banner", bannerSchema);
