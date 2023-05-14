import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { UsersBusiness } from "../business/UsersBusiness";
import { CreateUserInputSchema } from "../dto/createUser.dto";
import { ZodError } from "zod";
import { SignInInputSchema } from "../dto/signIn.dto";

export class UsersController {
  constructor(private usersBusiness: UsersBusiness) {}

  public createUser = async (req: Request, res: Response) => {
    try {
      const input = CreateUserInputSchema.parse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.usersBusiness.createUser(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public signIn = async (req: Request, res: Response) => {
    try {
      const input = SignInInputSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });
      const output = await this.usersBusiness.signIn(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  }
}
