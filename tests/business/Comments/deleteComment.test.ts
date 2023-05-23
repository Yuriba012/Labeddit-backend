import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";
import { CommentsBusiness } from "../../../src/business/CommentsBusiness";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { DeleteCommentInputSchema } from "../../../src/dto/deleteComment.dto";

describe("Teste do método putLikeComment", () => {
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de sucesso para exclusão de um comentário para um usuário com permissões NORMAIS que deseja excluir o próprio comentário.", async () => {
    const input = DeleteCommentInputSchema.parse({
      token: "token-mock-user1",
      idToDelete: "c001"
    });

    const output = await commentsBusiness.deleteComment(input);
    expect(output).toEqual({
      message: "Seu comentário foi excluído",
    });
  });

  test("Caso de sucesso para exclusão de um post para um usuário com permissões ADMIN que deseja excluir um post pertencente a outro usuário.", async () => {
    const input = DeleteCommentInputSchema.parse({
      token: "token-mock-user2",
      idToDelete: "c001"
    });

    const output = await commentsBusiness.deleteComment(input);
    expect(output).toEqual({
      message: "Seu comentário foi excluído",
    });
  });
});
