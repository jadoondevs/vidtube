import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter
  .route("/toggle-sub/:channelId")
  .post(verifyJWT, toggleSubscription);

  subscriptionRouter.route("/get-subscribed-channels").get(verifyJWT, getSubscribedChannels);

subscriptionRouter
  .route("/get-subscribers/:channelId")
  .get(getUserChannelSubscribers);

export default subscriptionRouter;
