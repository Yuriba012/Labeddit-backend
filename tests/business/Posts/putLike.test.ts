import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PutLikeInputSchema } from "../../../src/dto/putLike.dto";

describe("Teste do método putLike", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição em que o usuário não possui um like e/ou um dislike no post especificado na requisição", async () => {
    const input = PutLikeInputSchema.parse({
        postId: "p003",
        like: true,
        token: "token-mock-user1"
    })
    const output = await postsBusiness.putLike(input)

    expect(output).toEqual({
        message: "Seu Like/Dislike foi enviado!"
    })
  });

  test("Caso de requisição em que o usuário envia uma reação (like/dislike) duas vezes consecutivas, nesse caso, o like/dislike é anulado/removido.", async () => {
    const input = PutLikeInputSchema.parse({
        postId: "p002",
        like: true,
        token: "token-mock-user1"
    })
    const output = await postsBusiness.putLike(input)

    expect(output).toEqual({
        message: "Seu Like/Dislike foi removido!"
    })
  });

  test("Caso de requisição em que o usuário envia uma segunda reação (like/dislike) diferente da reação anterior, nesse caso, o like/dislike é sobrescrito.", async () => {
    const input = PutLikeInputSchema.parse({
        postId: "p002",
        like: false,
        token: "token-mock-user1"
    })
    const output = await postsBusiness.putLike(input)

    expect(output).toEqual({
        message: "Seu Like/Dislike foi alterado!"
    })
  });
});
