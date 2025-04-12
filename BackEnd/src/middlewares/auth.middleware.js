import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler.js";
const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Access Token is required");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded?.id) {
      throw new ApiError(401, "Invalid access token");
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access Token");
  }
});

export default verifyJWT;
