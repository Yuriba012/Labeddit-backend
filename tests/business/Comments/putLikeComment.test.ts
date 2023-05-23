import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";
import { CommentsBusiness } from "../../../src/business/CommentsBusiness";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PutLikeCommentInputSchema } from "../../../src/dto/putLikeComment.dto";

describe("Teste do método putLikeComment", () => {
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição em que o usuário não possui um like e/ou um dislike no comentário especificado na requisição", async () => {
    const input = PutLikeCommentInputSchema.parse({
        token: "token-mock-user1",
        commentId: "c003",
        like: true
    })
    const output = await commentsBusiness.putLikeComment(input)

    expect(output).toEqual({
        message: "Seu Like/Dislike foi enviado!"
    })
  });

  test("Caso de requisição em que o usuário envia uma reação (like/dislike) duas vezes consecutivas, nesse caso, o like/dislike é anulado/removido.", async () => {
    const input = PutLikeCommentInputSchema.parse({
      token: "token-mock-user1",
      commentId: "c002",
      like: true
    })
    const output = await commentsBusiness.putLikeComment(input)

    expect(output).toEqual({
        message: "Seu Like/Dislike foi removido!"
    })
  });

  test("Caso de requisição em que o usuário envia uma segunda reação (like/dislike) diferente da reação anterior, nesse caso, o like/dislike é sobrescrito.", async () => {
    const input = PutLikeCommentInputSchema.parse({
      token: "token-mock-user1",
      commentId: "c002",
      like: false
    })
    const output = await commentsBusiness.putLikeComment(input)

    expect(output).toEqual({
        message: "Seu Like/Dislike foi alterado!"
    })
  });
});
