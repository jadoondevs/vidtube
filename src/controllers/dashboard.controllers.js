import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
// import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;
    const totalVideos = await Video.countDocuments({ owner: channelId });
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    return res
    .status(200)
    .json( 
      new ApiResponse(200, {totalVideos, totalSubscribers},  "Channel stats fetched successfully!")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // already done in videos.controller by name of getAllVideosByUserId
});

export { getChannelStats, getChannelVideos };
