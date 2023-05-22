import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { EditPostInputSchema } from "../../../src/dto/editPost.dto";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";

describe("Teste do método editPost", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição bem sucedida", async () => {
    const input = EditPostInputSchema.parse({
      idToEdit: "p001",
      newContent: "Novo conteúdo teste",
      token: "token-mock-user1",
    });

    const output = await postsBusiness.editPost(input);

    expect(output).toEqual({
      message: "Post modificado com sucesso.",
    });
  });
});
