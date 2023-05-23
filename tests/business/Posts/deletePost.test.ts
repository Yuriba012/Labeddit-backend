import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { DeletePostInputSchema } from "../../../src/dto/deletePost.dto";

describe("Teste do método deletePost", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de sucesso para exclusão de um post para um usuário com permissões NORMAIS que deseja excluir o próprio post.", async () => {
    const input = DeletePostInputSchema.parse({
      idToDelete: "p001",
      token: "token-mock-user1",
    });

    const output = await postsBusiness.deletePost(input);
    expect(output).toEqual({
      message: "Seu post foi excluído",
    });
  });

  test("Caso de sucesso para exclusão de um post para um usuário com permissões ADMIN que deseja excluir um post pertencente a outro usuário.", async () => {
    const input = DeletePostInputSchema.parse({
      idToDelete: "p001",
      token: "token-mock-user2",
    });

    const output = await postsBusiness.deletePost(input);
    expect(output).toEqual({
      message: "Seu post foi excluído",
    });
  });
});
