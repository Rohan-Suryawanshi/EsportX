import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary, destroyImage } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

const registerUser = AsyncHandler(async (req, res) => {
  // Step 1: Extract User Inputs
  const { username, email, password } = req.body;

  // Step 2: Validate Inputs
  if ([username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Step 3: Check if Username or Email Already Exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  // Step 4: Handle Image Uploads
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let avatar = null;
  if (avatarLocalPath) {
    avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar?.url) {
      throw new ApiError(500, "Failed to upload avatar image");
    }
  }

  // Step 5: Create New User in Database
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    avatar: avatar?.url,
    password,
  });

  // Step 5: Fetch Created User Without Password and Refresh Token
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // Step 6: Send Response
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Successfully"));
});
const deleteUser = AsyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Find user without password & refreshToken, then delete
  const user = await User.findById(userId).select("-password -refreshToken");

  //http://res.cloudinary.com/codewithrohan/image/upload/v1742243128/uovndpbrtmgb99iwel15.jpg
  if (user.avatar) {
    await destroyImage(user.avatar);
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndDelete(userId);

  let userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    walletBalance: user.walletBalance,
  };

  res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User deleted Successfully"));
});

const getUser = AsyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
});

const updateUser = AsyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const { username, email, password } = req.body;
  // let updateFields = {}; // Store only updated fields

  let user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let avatarPath = req.file ? req.file.path : ""; 
  if (avatarPath) {
    if (user.avatar) {
      await destroyImage(user.avatar); // Delete old avatar
    }
    const uploadedAvatar = await uploadToCloudinary(avatarPath);
    if (!uploadedAvatar?.url) {
      throw new ApiError(500, "Failed to upload avatar image");
    }
    user.avatar = uploadedAvatar.url;
  }

  // Update username and email if provided
  if (username){
    const existingUser=await User.findOne({username:username.toLowerCase().trim()});
    if(!existingUser)
    {
      user.username = username.toLowerCase().trim();
    }
    else{
      throw new ApiError(409, "Username already exists");
    }
  }

  if (email) {
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!existingEmail) {
      user.email = email.toLowerCase().trim();
    } else {
      throw new ApiError(409, "Username already exists");
    }
  }

  // Hash password before saving
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  user = await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

export { registerUser, deleteUser, getUser, updateUser };
