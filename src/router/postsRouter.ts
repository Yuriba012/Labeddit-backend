import express from "express";
import { PostsController } from "../controlller/PostsController";
import { PostsBusiness } from "../business/PostsBusiness";
import { PostsDatabase } from "../database/PostsDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { UsersDatabase } from "../database/UsersDatabase";
import { TokenManager } from "../services/TokenManager";
import { CommentsDatabase } from "../database/CommentsDatabase";

export const postsRouter = express.Router();

const postsController = new PostsController(
  new PostsBusiness(new PostsDatabase(), new UsersDatabase(), new IdGenerator(), new TokenManager())
);

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:id", postsController.getPostById);
postsRouter.post("/", postsController.createPost);
postsRouter.put("/:id", postsController.editPost);
postsRouter.put("/:id/like", postsController.putLike);
postsRouter.delete("/:id", postsController.deletePost);

