import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UsersDatabaseMock } from "../../mocks/UsersDatabaseMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { GetPostsSchema } from "../../../src/dto/getPosts.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("Teste do método getPosts", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new UsersDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Caso de requisição bem sucedida", async () => {
    const input = GetPostsSchema.parse({
      token: "token-mock-user1",
    });

    const output = await postsBusiness.getPosts(input);

    expect(output).toEqual([
      {
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
      },
      {
        id: "p002",
        content: "post de user2",
        likes: 0,
        dislikes: 0,
        comments: 0,
        createdAt: expect.any(String),
        updatedAt: "",
        creator: {
          id: "u002",
          name: "user2",
        },
      },
      {
        id: "p003",
        content: "post de user3",
        likes: 0,
        dislikes: 0,
        comments: 0,
        createdAt: expect.any(String),
        updatedAt: "",
        creator: {
          id: "u003",
          name: "user3",
        },
      },
    ]);
  });

  test("Deve retornar um erro informando que não foram encontrados posts", async () => {
    expect.assertions(2);
    try {
      const input = GetPostsSchema.parse({
        token: "token-mock-user1",
        query: "user57",
      });

      const output = await postsBusiness.getPosts(input);
      console.log(output);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Nenhum post foi encontrado.");
      }
    }
  });
});
