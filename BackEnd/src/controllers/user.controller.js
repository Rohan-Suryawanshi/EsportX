import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary, destroyImage } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const deleteLocalFile = (fileName) => {
  if (fs.existsSync(fileName)) {
    fs.unlink(fileName, (err) => {
      if (err) console.error("Error deleting local file:", err);
      else console.log("Local file deleted:", fileName);
    });
  }
};
const registerUser = AsyncHandler(async (req, res) => {
  // Step 1: Extract User Inputs
  const { username, email, password } = req.body;

  // Step 2: Handle Image Uploads (Before Validation)
  const avatarLocalPath = req.file ? req.file.path : ""; // Store the path in case we need to delete it
  let avatar = null;

  // Step 3: Validate Inputs
  if ([username, email, password].some((field) => !field?.trim())) {
    if (avatarLocalPath) {
      deleteLocalFile(avatarLocalPath); // Delete uploaded image if validation fails
    }
    throw new ApiError(400, "All fields are required");
  }

  // Step 4: Check if Username or Email Already Exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (avatarLocalPath) {
      deleteLocalFile(avatarLocalPath); // Delete uploaded image if user already exists
    }
    throw new ApiError(409, "Username or Email already exists");
  }

  // Step 5: Upload Image to Cloudinary
  if (avatarLocalPath) {
    avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar?.url) {
      throw new ApiError(500, "Failed to upload avatar image");
    }
  }

  // Step 6: Create New User in Database
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    avatar: avatar?.url,
    password,
  });

  // Step 7: Fetch Created User Without Password and Refresh Token
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    await destroyImage(avatar.url);
    throw new ApiError(500, "Failed to create user");
  }

  // Step 8: Send Response
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

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //http://res.cloudinary.com/codewithrohan/image/upload/v1742243128/uovndpbrtmgb99iwel15.jpg
  if (user.avatar) {
    await destroyImage(user.avatar);
  }

  await user.deleteOne();

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

  let user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let avatarPath = req.file ? req.file.path : "";
  if (avatarPath) {
    const uploadedAvatar = await uploadToCloudinary(avatarPath);
    if (!uploadedAvatar?.url) {
      throw new ApiError(500, "Failed to upload avatar image");
    }
    if (user.avatar) {
      await destroyImage(user.avatar); // Delete old avatar
    }
    user.avatar = uploadedAvatar.url;
  }

  // Update username and email if provided
  if (username && user.username !== username.trim()) {
    const existingUser = await User.findOne({
      username: username.toLowerCase().trim(),
      _id: { $ne: userId },
    });
    if (!existingUser) {
      user.username = username.toLowerCase().trim();
    } else {
      throw new ApiError(409, "Username already exists");
    }
  }

  if (email && user.email !== email.trim()) {
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: userId },
    });
    if (!existingEmail) {
      user.email = email.toLowerCase().trim();
    } else {
      throw new ApiError(409, "Email already exists");
    }
  }

  if (password) {
    user.password = password;
  }

  user = await user.save();

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

const getAllUsers = AsyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res
    .status(200)
    .json(new ApiResponse(200, users, "Users retrieved successfully"));
});

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to generate access token and refresh token"
    );
  }
};
const loginUser = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    throw new ApiError(401, "Invalid Password");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiResponse(200, { user: loginUser, accessToken, refreshToken }));
});
const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: undefined,
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const token =
    req.cookies?.refreshToken || req.header.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Access Token Is required");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    if (token !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }
    const option = {
      httpOnly: true,
      secure: true,
    };
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    res
      .status(200)
      .cookie("accessToken", newAccessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

const changeCurrentUserPassword = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "User is not authenticated");
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current Password and New Password are required");
  }
  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the current password"
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatched = await user.comparePassword(currentPassword);
  if (!isMatched) {
    throw new ApiError(401, "Invalid Current Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  req
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current User retrieved successfully")
    );
});

const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username and Email are required");
  }

  if (username && req.user.username !== username.trim()) {
    const existingUser = await User.findOne({
      username: username.toLowerCase().trim(),
      _id: { $ne: req.user._id },
    });
    if (!existingUser) {
      username = username.toLowerCase().trim();
    } else {
      throw new ApiError(409, "Username already exists");
    }
  }
  if (email && req.user.email !== email.trim()) {
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.user._id },
    });
    if (!existingUser) {
      email = email.toLowerCase().trim();
    } else {
      throw new ApiError(409, "Email already exists");
    }
  }
  const updatedUser=await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
   .status(200)
   .json(new ApiResponse(200, updatedUser, "User Account details updated successfully"));

});
export {
  registerUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
};
