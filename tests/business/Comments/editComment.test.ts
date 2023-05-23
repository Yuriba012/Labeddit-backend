import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";
import { CommentsBusiness } from "../../../src/business/CommentsBusiness";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { EditCommentInputSchema } from "../../../src/dto/editComment.dto";

describe("Teste do método editComment", () => {
  const commentsBusiness = new CommentsBusiness(
    new CommentsDatabaseMock(),
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição bem sucedida em que o usuário de 'id'='u001' executa alterações no próprio comentário de 'id'=c001", async () => {
    const input = EditCommentInputSchema.parse({
        token: "token-mock-user1",
        commentToEditId: "c001",
        newContent: "Novo conteúdo teste"
    });

    const output = await commentsBusiness.editComment(input);

    expect(output).toEqual({
      message: "Comentário modificado!"
    });
  });
});
