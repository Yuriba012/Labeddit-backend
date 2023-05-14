import z from "zod";

export interface EditCommentInputDTO {
  token: string;
  commentToEditId: string;
  newContent: string;
}

export interface EditCommentOutputDTO{
  message: string
}

export const EditCommentInputSchema = z
  .object({
    token: z.string({
        required_error:
          "Um token válido é obrigatório para efetuar a requisição",
        invalid_type_error: "Token deve ser do tipo string",
      }).min(0),
    commentToEditId: z.string({
      required_error:
        "'id' é obrigatório para efetuar a requisição",
      invalid_type_error: "'id' deve ser do tipo string",
    }),
    newContent: z.string({invalid_type_error: "'newContent' deve ter o tipo string"}).min(0),

  })
  .transform((data) => data as EditCommentInputDTO);
