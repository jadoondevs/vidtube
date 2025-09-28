import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter
  .route("/get-comments/:videoId")
  .get(getVideoComments);
commentRouter
  .route("/add-comment/:videoId")
  .post(verifyJWT, addComment);
commentRouter
  .route("/update-comment/:commentId")
  .patch(verifyJWT, updateComment);
commentRouter
  .route("/delete-comment/:commentId")
  .delete(verifyJWT, deleteComment);

export default commentRouter;
