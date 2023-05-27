import z from 'zod'

export interface GetCommentsInputDTO {
    token: string;
    postId: string;
}

export interface GetCommentsOutputDTO{
    id: string;
    content: string;
    likes: number;
    dislikes: number;
    reaction: boolean|null;
    createdAt: string;
    updatedAt: string;
    postId: string;
    creator: {
      id: string;
      name: string;
    };
}

export const GetCommentInputSchema = z.object({
    token: z.string({
        required_error: "Um token válido é obrigatório para efetuar a requisição",
        invalid_type_error: "Token deve ser do tipo string",
      }),
      postId: z
        .string({ invalid_type_error: "'postId' deve ser do tipo string" })
        .min(0)
    })
    .transform((data) => data as GetCommentsInputDTO);