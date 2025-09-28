import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(
      400,
      "Name and description are required to create a playlist!"
    );
  }

  if (typeof name !== "string" || typeof description !== "string") {
    throw new ApiError(400, "Name and description must be strings!");
  }

  if (!req.user?._id || !isValidObjectId(req.user._id)) {
    throw new ApiError(400, "Invalid user ID or user not loggedIn!");
  }

  const existing = await Playlist.findOne({ name, owner: req.user._id });
  if (existing) {
    throw new ApiError(400, "Playlist with the same name already exists!");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const playlists = await Playlist.find({ owner: userId });

  const totalPlaylists = playlists.length;
  if (totalPlaylists === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No playlists found for this user!"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalPlaylists, playlists },
        "Playlists fetched successfully!"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  if (!playlistId?.trim()) {
    throw new ApiError(400, "Playlist ID is required");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate([
      // {path: "videos"}, // adjust as needed
      "videos",
      { path: "owner", select: "name email" },
    ])
    .select("name description videos owner");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully!"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist ID or video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // const video = await video.findById(videoId);
  // if (!video) {
  //     throw new ApiError(404, "Video not found");
  // }
  // Check if video is already in playlist
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in the playlist");
  }
  playlist.videos.push(videoId);
  await playlist.save();

  //   await Playlist.findById(playlistId).populate([
  //     { path: "videos", select: "title description" },
  //     { path: "owner", select: "name email" },
  //   ]).select("name description videos owner");
  const populatedPlaylist = await Playlist.findById(playlistId)
    .populate([
      { path: "videos", select: "title description" },
      { path: "owner", select: "name email" },
    ])
    .select("name description videos owner");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedPlaylist,
        "Video added to playlist successfully!"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist ID or video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  // Check if video is in playlist
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not found in the playlist");
  }
  playlist.videos.pull(videoId);
  await playlist.save();
  const populatedPlaylist = await Playlist.findById(playlistId)
    .populate([
      { path: "videos", select: "title description" },
      { path: "owner", select: "name email" },
    ])
    .select("name description videos owner");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedPlaylist,
        "Video removed from playlist successfully!"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if(!isValidObjectId(playlistId)){
    throw new ApiError(400, "Invalid playlist ID");
  }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    await playlist.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted successfully!"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if(!isValidObjectId(playlistId)){
    throw new ApiError(400, "Invalid playlist ID");
  }
  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Name and description are required");
  }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    playlist.name = name;
    playlist.description = description;
    await playlist.save();
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully!"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
