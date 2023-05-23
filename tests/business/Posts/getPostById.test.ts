import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { EditPostInputSchema } from "../../../src/dto/editPost.dto";

describe("Teste do método editPost", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  
  test("Caso de requisição bem sucedida", async () => {
    const input = {
        id: "p001",
        token:"token-mock-user1"
    }

    const output = await postsBusiness.getPostById(input)
    expect(output).toEqual({
        id: "p001",
        content: "post de user1",
        likes: 0,
        dislikes: 0,
        comments: 0,
        createdAt: expect.any(String),
        updatedAt: "",
        creator: {
          id: "u001",
          name: "user1",
        },
    })
  })
})