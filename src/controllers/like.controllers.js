import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id or video not found!");
    return;
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id or User not found!");
    return;
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });
  try {
    if (existingLike) {
      await existingLike.deleteOne();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingLike,
            "Like removed from video successfully!"
          )
        );
    }

    const newLike = await Like.create({
      video: videoId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Like added to video successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(403, "Something went wrong!");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  const userId = req.user._id;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id or comment not found!");
    return;
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id or User not found!");
    return;
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  try {
    if (existingLike) {
      await existingLike.deleteOne();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingLike,
            "Like removed from comment successfully!"
          )
        );
    }

    const newLike = await Like.create({
      comment: commentId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, newLike, "Like added to comment successfully")
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(403, "Something went wrong!");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id or tweet not found!");
    return;
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id or User not found!");
    return;
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  try {
    if (existingLike) {
      await existingLike.deleteOne();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingLike,
            "Like removed from tweet successfully!"
          )
        );
    }

    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Like added to tweet successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(403, "Something went wrong!");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId);

  const likedVideos = await Like.find({
    video: { $ne: null },
    likedBy: userId,
  })
    .populate({ path: "video", select: "title description _id" })
    .populate({ path: "likedBy", select: "email" });

  if (!likedVideos.length) {
    throw new ApiError(404, "No video liked by this user found!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully!")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
