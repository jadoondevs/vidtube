import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controllers.js";

const likeRouter = Router();
likeRouter.route("/toggle-vid-like/:videoId").post(verifyJWT, toggleVideoLike);
likeRouter
  .route("/toggle-comment-like/:commentId")
  .post(verifyJWT, toggleCommentLike);
likeRouter
  .route("/toggle-tweet-like/:tweetId")
  .post(verifyJWT, toggleTweetLike);
likeRouter.route("/get-liked-vids/").get(verifyJWT, getLikedVideos);

export default likeRouter;
