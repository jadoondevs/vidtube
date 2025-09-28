import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscriberId = req.user?._id;

  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    //unsub
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully!"));
  }

  //new sub
  const newSubscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newSubscription, "Subscribed successfully!"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "username email"
  );
  const subsCount = await Subscription.countDocuments({ channel: channelId });
  return res
    .status(200)
    .json( 
      new ApiResponse(200, {subsCount, subscribers},  "Subscribers fetched successfully!")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId  = req.user?._id;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate(
    "channel",
    "username email"
  );

  const subsCount = await Subscription.countDocuments({ subscriber: subscriberId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { subsCount,subscriptions}, "Subscribed channels fetched successfully!")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
