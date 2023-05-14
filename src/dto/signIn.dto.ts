import z from "zod";

export interface SignInInputDTO {
  email: string;
  password: string;
}

export interface SignInOutputDTO {
  message: string;
  userName: string;
  token: string;
}

export const SignInInputSchema = z
  .object({
    email: z
      .string({
        required_error: "'email' é obrigatório para efetuar a requisição",
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email()
      .min(0),
    password: z
      .string({
        required_error: "'password' é obrigatório para efetuar a requisição",
        invalid_type_error: "'password' deve ser do tipo string",
      })
      .min(0),
  })
  .transform((data) => data as SignInInputDTO);
