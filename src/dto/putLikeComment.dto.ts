import z from "zod";

export interface PutLikeCommentInputDTO {
    token: string;
    commentId: string;
    like: boolean;
}

export interface PutLikeCommentOutputDTO{
  message: string
}

export const PutLikeCommentInputSchema = z
  .object({
    token: z.string({
        required_error:
          "Um token válido é obrigatório para efetuar a requisição",
        invalid_type_error: "Token deve ser do tipo string",
      }).min(0),
    commentId: z.string({
      required_error:
        "'postId' é obrigatório para efetuar a requisição",
      invalid_type_error: "'postId' deve ser do tipo string",
    }).min(0),
    like: z.boolean({
      required_error:
        "'like' é obrigatório para efetuar a requisição",
      invalid_type_error: "'like' deve ser do tipo boolean",
    })
  })
  .transform((data) => data as PutLikeCommentInputDTO);
