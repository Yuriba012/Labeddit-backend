import z from "zod";

export interface CreateCommentInputDTO {
  token: string;
  postId: string;
  content: string;
}

export interface CreateCommentOutputDTO {
  message: string;
}

export const CreateCommentInputSchema = z
  .object({
    token: z
    .string({
      required_error:
        "Um token válido é obrigatório para efetuar a requisição",
      invalid_type_error: "Token deve ser do tipo string",
    })
    .min(0),
    postId: z
    .string({
      required_error:
        "O 'id' da postagem é obrigatório para efetuar a requisição",
      invalid_type_error: "'postId' deve ser do tipo string",
    })
    .min(0),
    content: z
      .string({
        required_error: "É obrigatório informar um 'content'",
        invalid_type_error: "'content' deve ter o tipo string",
      })
      .min(1, "Você precisa escrever um conteúdo para o seu comentário."),
      
  })
  .transform((data) => data as CreateCommentInputDTO);
