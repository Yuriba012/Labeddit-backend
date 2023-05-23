import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { CommentsDatabaseMock } from "../../mocks/CommentsDatabaseMock";
import { CommentsBusiness } from "../../../src/business/CommentsBusiness";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { CreateCommentInputSchema } from "../../../src/dto/createComment.dto";

describe("Teste do método createComment", () => {
    const commentsBusiness = new CommentsBusiness(new CommentsDatabaseMock(), new PostsDatabaseMock(), new UsersDatabaseMock(), new IdGeneratorMock(), new TokenManagerMock())

    test("Caso de requisição bem sucedida em que o usuário de 'id'='u001' insere um comentário no post de 'id'='p002'", async () => {
        const input = CreateCommentInputSchema.parse({
            content: "publicação teste",
            postId: "p002",
            token: "token-mock-user1"
        })

        const output = await commentsBusiness.createComment(input)

        expect(output).toEqual({
            message: "Comentário publicado!"
        })
    })
})