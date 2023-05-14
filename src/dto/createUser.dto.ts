import z from "zod";

export interface CreateUserInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserOutputDTO {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export const CreateUserInputSchema = z
  .object({
    name: z
      .string({
        required_error: "'name' é obrigatório para efetuar a requisição",
        invalid_type_error: "'name' deve ser do tipo string",
      })
      .min(2),
    email: z
      .string({
        required_error: "'email' é obrigatório para efetuar a requisição",
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email({ message: "'email' deve ter o formato 'meuemail@email.com'" }),
    password: z
      .string({
        required_error: "'password' é obrigatório para efetuar a requisição",
        invalid_type_error: "'password' deve ser do tipo string",
      })
      .min(8, { message: "A senha deve conter no mínimo 8 caracteres." })
      .max(12, { message: "A senha deve conter no máximo 12 caracteres." })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/, {
        message: "A senha deve conter caracteres numéricos e alfanuméricos.",
      }),
  })
  .transform((data) => data as CreateUserInputDTO);
