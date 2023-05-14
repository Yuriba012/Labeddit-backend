import { PostsDatabase } from "../database/PostsDatabase";
import { UsersDatabase } from "../database/UsersDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dto/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dto/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dto/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dto/getPosts.dto";
import { PutLikeInputDTO, PutLikeOutputDTO } from "../dto/putLike.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { InputLikeDB } from "../types/InputLikeDB";
import {
  EditedPostToDB,
  PostInputDB,
  PostOutputDB,
  PostRawDB,
} from "../types/PostDB";

export class PostsBusiness {
  constructor(
    private postsDatabase: PostsDatabase,
    private usersDatabase: UsersDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO[]> => {
    const { token, query } = input;

    const isTokenValid = this.tokenManager.getPayload(token);

    if (!isTokenValid) {
      throw new BadRequestError("Token inválido");
    }

    const posts: PostOutputDB[] = await this.postsDatabase.getPosts(query);

    const checkedPosts: Post[] = posts.map(
      (post) =>
        new Post(
          post.id,
          post.content,
          post.likes,
          post.dislikes,
          post.created_at,
          post.updated_at,
          { id: post.creator_id, name: post.name }
        )
    );

    const output: GetPostsOutputDTO[] = checkedPosts.map((post) => {
      return {
        id: post.getId(),
        content: post.getContent(),
        likes: post.getLikes(),
        dislikes: post.getDislikes(),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt(),
        creator: post.getCreator(),
      };
    });
    return output;
  };

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const newPost: PostInputDB = {
      id: this.idGenerator.generate() as string,
      creator_id: payload.id as string,
      content: content as string,
    };

    const postExists = await this.postsDatabase.getPostByIdDBForm(newPost.id);

    if (postExists) {
      throw new BadRequestError("Post já existe.");
    }

    await this.postsDatabase.createPost(newPost);

    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso.",
    };
    return output;
  };

  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { idToEdit, newContent, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const postToEdit: PostOutputDB | undefined =
      await this.postsDatabase.getPostByIdOutputForm(idToEdit);

    if (!postToEdit) {
      throw new NotFoundError("Não há post correspondente ao 'id' informado");
    }

    if (payload.id !== postToEdit.creator_id) {
      throw new BadRequestError(
        "O post deve pertencer ao usuário logado para que possa editá-lo"
      );
    }

    const inputDB: EditedPostToDB = {
      idToEdit,
      newPost: {
        content: newContent,
        updated_at: new Date().toISOString(),
      },
    };
    await this.postsDatabase.editPost(inputDB);

    const output: EditPostOutputDTO = {
      message: "Post modificado com sucesso.",
    };
    return output;
  };

  public putLike = async (
    input: PutLikeInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { postId, like, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const userId = payload.id;

    const inputLikeDB: InputLikeDB = {
      userId,
      postId,
      like,
    };

    //Busca pelo post no banco de dados.
    const postDB = await this.postsDatabase.getPostByIdDBForm(postId);

    //Verifica se o post existe.
    if (!postDB) {
      throw new NotFoundError("Post não existe.");
    }

    const userDB = await this.usersDatabase.getUserById(userId);

    //Verifica se o usuário existe.
    if (!userDB) {
      throw new NotFoundError("Usuário não existe.");
    }

    //Verifica se o post não pertence ao próprio usuário.
    if (postDB?.creator_id === userId) {
      throw new BadRequestError("O usuário não pode reagir ao próprio post.");
    }

    const likeDB = await this.postsDatabase.getLike(inputLikeDB);

    let output: PutLikeOutputDTO = {
      message: "",
    };

    //Verifica se o usuário já possui uma reação ao post.
    if (!likeDB) {
      //Caminho se for a primeira reação do usuário ao post.
      await this.postsDatabase.createLike(inputLikeDB);
      await this.postsDatabase.addLikeInPost(inputLikeDB);
      output.message = "Like/Dislike enviado com sucesso.";
    } else {
      //Caminho para o caso de o usuário já possuir uma reação ao post.
      //Verifica se o like/dislike é igual ao like/dislike já registrado para o post.
      if (likeDB.like === like) {
        //Caminho para o caso de que o like enviado pelo usuário é igual ao like enviado anteriormente;
        //Deleta o like/dislike feito anteriormente pelo usuário.
        await this.postsDatabase.deleteLike(inputLikeDB);
        //Decremento do like/dislike feito no post anteriormente pelo usuário.
        await this.postsDatabase.decreaseLikeInPost(inputLikeDB);
        output.message = "Like/Dislike removido com sucesso.";
      } else {
        //Caminho para o caso de que o like enviado pelo usuário é diferente do like enviado anteriormente.
        //Inverte o like no banco de dados (tabela de relações user x post).
        await this.postsDatabase.changeLike(inputLikeDB);
        //Converte like em dislike ou vice-versa no post no banco de dados.
        await this.postsDatabase.overwriteLikeInPost(inputLikeDB);
        output.message = "Like/Dislike alterado com sucesso.";
      }
    }
    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const postExists = await this.postsDatabase.getPostByIdDBForm(idToDelete);
    if (!postExists) {
      throw new NotFoundError(
        "Não há um post correspondente para o 'id' informado."
      );
    }

    if (payload.id !== postExists.creator_id) {
      throw new BadRequestError(
        "O post deve pertencer ao usuário logado para que possa deletá-lo"
      );
    }

    await this.postsDatabase.deletePost(idToDelete);
    const output: DeletePostOutputDTO = {
      message: "Post deletado com sucesso.",
    };
    return output;
  };
}
