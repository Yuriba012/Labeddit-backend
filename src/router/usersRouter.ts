import express from "express";
import { UsersController } from "../controlller/UsersController";
import { UsersBusiness } from "../business/UsersBusiness";
import { UsersDatabase } from "../database/UsersDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

export const usersRouter = express.Router();

const usersController = new UsersController(
  new UsersBusiness(new UsersDatabase(), new IdGenerator(), new TokenManager(), new HashManager())
);

usersRouter.post("/signup", usersController.createUser);
usersRouter.post("/signin", usersController.signIn);

