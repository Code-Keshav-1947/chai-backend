import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user.id;
  const totalVideos = await Video.countDocuments({ channelId });
  const totalSubscribers = await Subscription.countDocuments({ channelId });
  const totalLikes = await Like.countDocuments({ channelId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalVideos, totalSubscribers, totalLikes },
        "Channel stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user.id;
  const videos = await Video.find({ channelId }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
