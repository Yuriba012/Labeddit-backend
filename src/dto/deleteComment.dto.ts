import z from 'zod'


export interface DeleteCommentInputDTO{
    token: string
    idToDelete: string,
}

export interface DeleteCommentOutputDTO{
    message: string
}

export const DeleteCommentInputSchema = z.object({
    token: z.string({
        required_error:
          "Um token válido é obrigatório para efetuar a requisição",
        invalid_type_error: "Token deve ser do tipo string",
      }).min(0),
    idToDelete: z.string({
        required_error:
          "Um 'id' é obrigatório para efetuar a requisição",
        invalid_type_error: "'id' deve ser do tipo string",
      }).min(0)
}).transform((data)=>data as DeleteCommentInputDTO)