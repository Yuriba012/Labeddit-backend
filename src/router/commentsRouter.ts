import express from "express";
import { PostsDatabase } from "../database/PostsDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { UsersDatabase } from "../database/UsersDatabase";
import { TokenManager } from "../services/TokenManager";
import { CommentsController } from "../controlller/CommentsController";
import { CommentsBusiness } from "../business/CommentsBusiness";
import { CommentsDatabase } from "../database/CommentsDatabase";

export const commentsRouter = express.Router();

const commentsController = new CommentsController(
  new CommentsBusiness(
    new CommentsDatabase(),
    new PostsDatabase(),
    new UsersDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

commentsRouter.get("/:postId", commentsController.getComments);
commentsRouter.post("/:postId", commentsController.createComment);
commentsRouter.put("/:id", commentsController.editComment);
commentsRouter.put("/:id/like", commentsController.putLikeComment);
commentsRouter.delete("/:id", commentsController.deleteComment);
