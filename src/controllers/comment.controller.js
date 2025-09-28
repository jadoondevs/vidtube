// import mongoose from "mongoose";
import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Video not found!");
  }

  const comments = await Comment.find({ video: videoId });

  const totComments = comments.length;
  if (totComments === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No comments found on this video!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totComments, comments },
        "Comments fetched successfully!"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  console.log("req.user:", req.user);
  const owner = req.user._id;
  const content = req.body.content;
  const videoId = req.params.videoId;

  if (!isValidObjectId(owner) || !owner) {
    throw new ApiError(400, "Invalid UserId or User not logged in!");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment must not be empty!");
  }

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id or video not found!");
  }

  const existing = await Comment.findOne({
    owner: owner,
    content: content,
  });
  if (existing) {
    throw new ApiError(400, "You cant add one comment twice!");
  }

  try {
    const comment = await Comment.create({
      content: content,
      video: videoId,
      owner: owner,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate({ path: "video", select: "title" })
      .populate({ path: "owner", select: "username" });
    return res
      .status(200)
      .json(
        new ApiResponse(200, populatedComment, "Comment added successfully!")
      );
  } catch (error) {
    throw new ApiError(
      500,
      [],
      "Something went wrong while creating the comment!"
    );
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const content = req.body.content;
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid CommentId or comment doesnt exist!");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Comment must not be empty!");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment with this Id not found!");
  }

  const existing = await Comment.findOne({
    owner: req.user._id,
    content: content,
  });
  if (existing) {
    throw new ApiError(400, "You cant add one comment twice!");
  }
  try {
    comment.content = content;
    await comment.save();
    const populatedComment = await Comment.findById(commentId)
      .populate({ path: "video", select: "title" })
      .populate({ path: "owner", select: "username" });
    return res
      .status(200)
      .json(
        new ApiResponse(200, populatedComment, "Comment edited successfully!")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong updating the comment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment doesnt exist!");
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "This comment can only be deleted by its owner!");
  }
  try {
    await comment.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, comment.content, "Comment deleted successfully!")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error,
      "Something went wrong deleting this comment!"
    );
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
