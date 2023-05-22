import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { UsersBusiness } from "../../../src/business/UsersBusiness";
import { CreateUserInputSchema } from "../../../src/dto/createUser.dto";

describe("Teste do método de criação de um usuário", () => {
    const usersBusiness = new UsersBusiness(
        new UsersDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
      );

    test("Caso de requisição bem sucedida", async () => {
        const input = CreateUserInputSchema.parse({
            name: "Nome teste User",
            email: "userteste@email.com",
            password: "teste123"
        })

        const output = await usersBusiness.createUser(input)
        console.log(output)
        expect(output).toEqual({
            message: "Usuário cadastrado com sucesso.",
            token: "token-mock",
            user: {
              id: "id-mock",
              name: "Nome teste User",
              createdAt: expect.any(String),
            },
        })
    })
});
