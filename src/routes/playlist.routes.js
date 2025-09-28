import Router from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
} from "../controllers/playlist.controllers.js";

const playlistRouter = Router();

playlistRouter.route("/create-playlist").post(verifyJWT, createPlaylist);

playlistRouter.route("/user-playlists/:userId").get(getUserPlaylists);

playlistRouter.route("/playlist-by-id/:playlistId").get(getPlaylistById);

playlistRouter.route("/add-video/:playlistId/:videoId").post(verifyJWT, addVideoToPlaylist);

playlistRouter.route("/remove-video/:playlistId/:videoId").delete(verifyJWT, removeVideoFromPlaylist);

playlistRouter.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist);

playlistRouter.route("/update-playlist/:playlistId").patch(verifyJWT, updatePlaylist);

export default playlistRouter;