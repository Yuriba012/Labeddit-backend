import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { UsersBusiness } from "../../../src/business/UsersBusiness";
import { SignInInputSchema } from "../../../src/dto/signIn.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Teste do método de login/signin", () => {
    const usersBusiness = new UsersBusiness(
        new UsersDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      );

    test("caso de requisição bem sucedida", async () => {
        const input = SignInInputSchema.parse({
            email: "user1@email.com",
            password: "user1password"
        })

        const output = await usersBusiness.signIn(input)

        expect(output).toEqual({
            message: "Usuário efetuou o login com sucesso.",
            userName: "user1",
            token: "token-mock-user1",
        })
    })
    
    test("caso de email não encontrado", async () => {
        expect.assertions(2);
        try {
            const input = SignInInputSchema.parse({
                email: "userinvalido@email.com",
                password: "user1password"
            })
    
            const output = await usersBusiness.signIn(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Email não encontrado")
            }
        }

    })

    test("caso de senha incorreta", async () => {
        expect.assertions(2);
        try {
            const input = SignInInputSchema.parse({
                email: "user1@email.com",
                password: "invalidPassword"
            })
    
            const output = await usersBusiness.signIn(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Email ou senha incorreto(s)")
            }
        }

    })
})