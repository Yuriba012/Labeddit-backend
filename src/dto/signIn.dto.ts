import z from "zod";

export interface SignInInputDTO {
  email: string;
  password: string;
}

export interface SignInOutputDTO {
  message: string;
  token: string;
  user:{
    id: string,
    name: string,
    createdAt: string
  }
}

export const SignInInputSchema = z
  .object({
    email: z
      .string({
        required_error: "'email' é obrigatório para efetuar a requisição",
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email({message: "'email' deve ter o formato 'meuemail@email.com'"})
      .min(0),
    password: z
      .string({
        required_error: "'password' é obrigatório para efetuar a requisição",
        invalid_type_error: "'password' deve ser do tipo string",
      })
      .min(0),
  })
  .transform((data) => data as SignInInputDTO);
