import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
// import { getPublicIdFromUrl } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

//get all videos posted by a certain user
const getAllVideosByUserId = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // console.log("User from request:", req.user);

  if (!userId) {
    throw new ApiError(400, "Invalid or missing user ID!");
  }

  const videos = await Video.find({ owner: userId });
  const totalVideos = videos.length;

  if (videos.length === 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(200, [], totalVideos, "No videos found for this user!")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, totalVideos, videos, "Videos fetched successfully!")
    );
});

// Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title || !description || !duration) {
    throw new ApiError(400, "Title, description and duration are required!");
  }

  const videoLocalPath = req?.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req?.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video file and thumbnail are required!");
  }

  let videoFile;
  try {
    videoFile = await uploadOnCloudinary(videoLocalPath, {
      resource_type: "video",
    });
    console.log("Uploaded videoFile", videoFile);
  } catch (error) {
    console.log("Error uploading videoFile!", error);
    throw new ApiError(500, "Failed to upload videoFile!");
  }

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log("Uploaded thumbnail", thumbnail);
  } catch (error) {
    console.log("Error uploading thumbnail!", error);
    throw new ApiError(500, "Failed to upload thumbnail!");
  }
  try {
    const video = await Video.create({
      title,
      description: description,
      videoFile:{
        url: videoFile.url,
        public_id: videoFile.public_id,
      },
      thumbnail: {
        url: thumbnail.url,
        public_id: thumbnail.public_id,
      },
      owner: req.user._id,
      duration: duration,
    });

    const uploadedVideo = await Video.findById(video._id).select("-duration");

    if (!uploadedVideo) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the video!"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, uploadedVideo, "Video uploaded successfully!")
      );
  } catch (error) {
    console.log("Video uploading failed!");

    if (videoFile) {
      await deleteFromCloudinary(videoFile.public_id);
    }
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }

    throw new ApiError(
      500,
      "Something went wrong while uploading the video and files were deleted!"
    );
  }
});

//get a video by using its title
const getVideoByTitle = asyncHandler(async (req, res) => {
  const { videoTitle } = req.params;
  if (!videoTitle?.trim()) {
    throw new ApiError(400, "Video title is required!");
  }

  const video = await Video.aggregate([
    {
      $match: {
        title: { $regex: videoTitle, $options: "i" },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },

    {
      $unwind: "$owner",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        videoFile: 1,
        views: 1,
        duration: 1,
        isPublished: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.email": 1,
        "owner.fullname": 1,
      },
    },
  ]);

  if (!video?.length) {
    throw new ApiError(404, "Video not found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video[0], "Video details fetched successfully!")
    );
});

//update a video
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  if (!videoId || !isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid or missing video ID!");
  }

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {$set: req.body},
      { new: true, runValidators: true } 
    )

    if (!updatedVideo) {
      throw new ApiError(404, "Video not found!");
    }
    
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully!"));

  } catch (error) {
    console.log("Error updating video:", error);
    throw new ApiError(500, "Failed to update video!");
    
  }

});


// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID!");
  }

  //find video by id
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // console.log(video.videoFile, video.thumbnail);

  try {
    // Extract public IDs
    const videoPublicId = video.videoFile.public_id;
    const thumbnailPublicId =video.thumbnail.public_id;

    // console.log("Video Public ID:", videoPublicId);
    // console.log("Thumbnail Public ID:", thumbnailPublicId);

    // Delete video from Cloudinary
    if (videoPublicId) {
      await deleteFromCloudinary(videoPublicId, { resource_type: "video" });
    }

    if (thumbnailPublicId) {
      await deleteFromCloudinary(thumbnailPublicId); // Default is image
    }

    //delete video from mondoDB

    await Video.findByIdAndDelete(videoId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully!"));
  } catch (error) {
    console.log("Error deleting video:", error);
    throw new ApiError(500, "Failed to delete video!");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideosByUserId,
  publishAVideo,
  getVideoByTitle,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
