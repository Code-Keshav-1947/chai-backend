import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getVideoDurationInSeconds } from "get-video-duration";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoFile, thumbnail } = req.files;
  const channelId = req.user.id;
  const videoFilePath = videoFile[0].path;
  const thumbnailPath = thumbnail[0].path;
  const duration = await getVideoDurationInSeconds(videoFilePath);
  console.log(
    "Video duration in seconds: ",
    duration,
    "videoFilePath: ",
    videoFilePath,
    "thumbnailPath: ",
    thumbnailPath,
    "channelId: ",
    channelId,
    "title: ",
    title,
    "description: ",
    description
  );
  const videoUploadResult = await uploadOnCloudinary(videoFilePath, "video");
  console.log("Video upload result:", videoUploadResult);
  const thumbnailUploadResult = await uploadOnCloudinary(
    thumbnailPath,
    "image"
  );
  const newVideo = await Video.create({
    title,
    description,
    videoUrl: videoUploadResult.secure_url,
    thumbnailUrl: thumbnailUploadResult.secure_url,
    duration,
    channelId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
