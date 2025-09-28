import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controllers.js";

const tweetRouter = Router();

tweetRouter.route("/create-tweet").post(verifyJWT, createTweet);
tweetRouter.route("/get-users-tweets").get(verifyJWT, getUserTweets);
tweetRouter.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet);
tweetRouter.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);

export default tweetRouter;
