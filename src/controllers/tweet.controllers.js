import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { content } = req.body;
  if (!isValidObjectId(userId)) {
    throw new ApiError(402, "Invalid user Id or user not found or logged in!");
    return;
  }

  if (!content.trim()) {
    throw new ApiError(402, "Tweet content must not be empty!!");
  }

  try {
    const tweet = await Tweet.create({
      content: content,
      owner: userId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully!"));
  } catch (error) {
    throw new ApiError(
      403,
      error,
      "Something went wrong while creating the tweet!"
    );
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id or user not found or loggedin");
  }

  const tweets = await Tweet.find({
    owner: userId,
  }).populate({ path: "owner", select: "name email" });
  if (!tweets.length) {
    throw new ApiError(404, "No tweets by this suser found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId or tweet not found!");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId or user not found or logged in!");
  }

  if (!content.trim()) {
    throw new ApiError(402, "Tweet content must not be empty!!");
  }

  const tweet = await Tweet.findById(tweetId).populate({
    path: "owner",
    select: "name email",
  });
  if (!tweet) {
    throw new ApiError(404, "Tweet not found!");
  }
  tweet.content = content;
  await tweet.save();
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully!"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId or tweet not found!");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId or user not found or logged in!");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet.owner===userId) {
    return new ApiError(403, "This tweet can be deleted by its owner only!")
  }
  await tweet.deleteOne()
  return res
  .status(200)
  .json(new ApiResponse(200, tweet, "Tweet deleted successfully!"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
