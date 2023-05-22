import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";
import { CommentsBusiness } from "../../../src/business/CommentsBusiness";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { GetCommentInputSchema } from "../../../src/dto/getComments.dto";

describe("Teste do método getComments", () => {
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição bem sucedida que retorna o os comentários do post de 'id'='p001'", async () => {
    const input = GetCommentInputSchema.parse({
      token: "token-mock-user1",
      postId: "p001",
    });

    const output = await commentsBusiness.getComments(input);

    expect(output).toEqual([
      {
        id: "c001",
        content: "comentário de user1",
        likes: 0,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: "",
        postId: "p001",
        creator: {
          id: "u001",
          name: "user1",
        },
      },
    ]);
  });
});
