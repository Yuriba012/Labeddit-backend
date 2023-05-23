import z from "zod";

export interface EditCommentInputDTO {
  token: string;
  commentToEditId: string;
  newContent: string;
}

export interface EditCommentOutputDTO {
  message: string;
}

export const EditCommentInputSchema = z
  .object({
    token: z
      .string({
        required_error:
          "Um token válido é obrigatório para efetuar a requisição",
        invalid_type_error: "Token deve ser do tipo string",
      })
      .min(0),
    commentToEditId: z.string({
      required_error: "'id' é obrigatório para efetuar a requisição",
      invalid_type_error: "'id' deve ser do tipo string",
    }),
    newContent: z
      .string({
        required_error: "Você não pode enviar um comentário algum conteúdo.",
        invalid_type_error: "'newContent' deve ter o tipo string",
      })
      .min(1, "Você precisa ter um conteúdo para o seu comentário."),
  })
  .transform((data) => data as EditCommentInputDTO);
