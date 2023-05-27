import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";
import { CommentsBusiness } from "../business/CommentsBusiness";
import { GetCommentInputSchema } from "../dto/getComments.dto";
import { CreateCommentInputSchema } from "../dto/createComment.dto";
import { EditCommentInputSchema } from "../dto/editComment.dto";
import { PutLikeCommentInputSchema } from "../dto/putLikeComment.dto";
import { DeleteCommentInputSchema } from "../dto/deleteComment.dto";

export class CommentsController {
  constructor(
    private commentsBusiness: CommentsBusiness
    
    ) {}

  public getComments = async (req: Request, res: Response) => {
    try {
      const input = GetCommentInputSchema.parse({
        token: req.headers.authorization as string,
        postId: req.params.postId as string
      });
      const output = await this.commentsBusiness.getComments(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentInputSchema.parse({
        token: req.headers.authorization as string,
        postId: req.params.postId as string,
        content: req.body.content
      }); 
      const output = await this.commentsBusiness.createComment(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  public editComment = async (req: Request, res: Response) => {
    try {
      const input = EditCommentInputSchema.parse({
        token: req.headers.authorization as string,
        commentToEditId: req.params.id as string,
        newContent: req.body.content
      }); 
      const output = await this.commentsBusiness.editComment(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  public putLikeComment = async (req: Request, res: Response) => {
    try {
      const input = PutLikeCommentInputSchema.parse({
        token: req.headers.authorization as string,
        commentId: req.params.id as string,
        like: req.body.like
      }); 
      const output = await this.commentsBusiness.putLikeComment(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  public deleteComment = async (req: Request, res: Response) => {
    try {
      const input = DeleteCommentInputSchema.parse({
        token: req.headers.authorization as string,
        idToDelete: req.params.id as string,
      }); 
      const output = await this.commentsBusiness.deleteComment(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
