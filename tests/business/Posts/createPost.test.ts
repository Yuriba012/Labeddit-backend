import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { CreatePostInputSchema } from "../../../src/dto/createPost.dto";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";

describe("Teste do método createPost", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição bem sucedida", async () => {
    const input = CreatePostInputSchema.parse({
      content: "publicação teste",
      token: "token-mock-user1",
    });

    const output = await postsBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post criado com sucesso.",
    });
  });
});
