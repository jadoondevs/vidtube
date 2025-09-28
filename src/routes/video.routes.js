import { Router } from "express";
import {
  getAllVideosByUserId,
  publishAVideo,
  getVideoByTitle,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const videoRouter = Router();

// secured routes
videoRouter.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

videoRouter.route("/get-videos-by-userId").get(verifyJWT, getAllVideosByUserId); // Get all videos of a user //done testing

videoRouter.route("/delete-video/:videoId").delete(verifyJWT ,deleteVideo); //done testing

videoRouter.route("/update-video/:videoId").patch(verifyJWT, updateVideo);

// unsecured routes

videoRouter.route("/get-video/:videoTitle").get(getVideoByTitle); // Get video by title // done testing


export default videoRouter;
