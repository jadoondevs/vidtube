import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import{
    getChannelStats,
    getChannelVideos
} from "../controllers/dashboard.controllers.js";

const dashboardRouter = Router();

dashboardRouter.route("/channel-stats/:channelId").get(getChannelStats);

export default dashboardRouter;