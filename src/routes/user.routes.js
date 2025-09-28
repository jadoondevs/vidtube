import { Router } from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const userRouter = Router();

//unsecured routes

userRouter.route("/register").post( 
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);//done testing

userRouter.route("/login").post(loginUser);//done testing
userRouter.route("/refresh-token").post(refreshAccessToken);//done testing

//secured routes

userRouter.route("/logout").post(verifyJWT, logoutUser);//done testing

userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);//done testing

userRouter.route("/current-user").get(verifyJWT, getCurrentUser);//done testing

userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile);//done testing

userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);//done testing

userRouter
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);//done testing

userRouter
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);//done testing

userRouter.route("/history").get(verifyJWT, getWatchHistory);//done testing

export default userRouter;
