import { CommentsDatabase } from "../database/CommentsDatabase";
import { PostsDatabase } from "../database/PostsDatabase";
import { UsersDatabase } from "../database/UsersDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dto/createComment.dto";
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dto/deleteComment.dto";
import { EditCommentInputDTO, EditCommentOutputDTO } from "../dto/editComment.dto";
import {
  GetCommentsInputDTO,
  GetCommentsOutputDTO,
} from "../dto/getComments.dto";
import { PutLikeCommentInputDTO, PutLikeCommentOutputDTO } from "../dto/putLikeComment.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentInputDB, CommentOutputDB, EditedCommentToDB } from "../types/Comment";
import { InputCommentLikeDB, InputLikeDB } from "../types/InputLikeDB";
import { USER_ROLE } from "../types/USER_ROLE";

export class CommentsBusiness {
  constructor(
    private commentsDatabase: CommentsDatabase,
    private postsDatabase: PostsDatabase,
    private usersDatabase: UsersDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getComments = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO[]> => {
    const { token, postId } = input;

    const isTokenValid = this.tokenManager.getPayload(token);

    const postExists = await this.postsDatabase.getPostByIdDBForm(postId);

    if (!isTokenValid) {
      throw new BadRequestError("Token inválido");
    }

    if (!postExists) {
      throw new NotFoundError("Post não existe");
    }

    const commentsDB: CommentOutputDB[] | undefined = await this.commentsDatabase.getComments(postId);

    if (!commentsDB) {
      throw new NotFoundError("Este post não possui comentários.");
    }

    const comments = commentsDB.map(
      (comment) =>
        new Comment(
          comment.id,
          comment.content,
          comment.likes,
          comment.dislikes,
          comment.created_at,
          comment.updated_at,
          comment.post_id,
          { id: comment.creator_id, name: comment.name }
        )
    );

    const output: GetCommentsOutputDTO[] = comments.map((comment) => {
      return {
        id: comment.getId(),
        content: comment.getContent(),
        likes: comment.getLikes(),
        dislikes: comment.getDislikes(),
        createdAt: comment.getCreatedAt(),
        updatedAt: comment.getUpdatedAt(),
        postId: comment.getPostId(),
        creator: comment.getCreator(),
      };
    });
    return output;
  };

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { token, postId, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const postExists = await this.postsDatabase.getPostByIdDBForm(postId);

    if (!postExists) {
      throw new BadRequestError("Postagem não existente.");
    }

    const newComment: CommentInputDB = {
      id: this.idGenerator.generate() as string,
      creator_id: payload.id as string,
      post_id: postId,
      content: content,
      created_at: new Date().toISOString(),
    };

    await this.commentsDatabase.createComment(newComment);

    const output: CreateCommentOutputDTO = {
      message: "Comentário publicado!",
    };
    return output;
  };
  public editComment = async (
    input: EditCommentInputDTO
  ): Promise<EditCommentOutputDTO> => {
    const { token, commentToEditId, newContent, } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const commentToEdit: CommentOutputDB | undefined =
      await this.commentsDatabase.getCommentById(commentToEditId);

    if (!commentToEdit) {
      throw new NotFoundError("Não há comentário correspondente ao id informado");
    }

    if (payload.id !== commentToEdit.creator_id) {
      throw new BadRequestError(
        "Somente o proprietário pode editar seu próprio comentário."
      );
    }

    const inputToEditDB: EditedCommentToDB= {
      idToEdit: commentToEditId,
      newComment: {
        content: newContent,
        updated_at: new Date().toISOString(),
      },
    };
    await this.commentsDatabase.editComment(inputToEditDB);

    const output: EditCommentOutputDTO = {
      message: "Comentário modificado!",
    };
    return output;
  };

  public putLikeComment = async (
    input: PutLikeCommentInputDTO
  ): Promise<PutLikeCommentOutputDTO> => {
    const { token, commentId, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const userId = payload.id;

    const inputLikeDB: InputCommentLikeDB = {
      userId,
      commentId,
      like,
    };

    //Busca pelo post no banco de dados.
    const commentDB = await this.commentsDatabase.getCommentById(commentId);

    //Verifica se o post existe.
    if (!commentDB) {
      throw new NotFoundError("Comentário não existe.");
    }

    const userDB = await this.usersDatabase.getUserById(userId);

    //Verifica se o usuário existe.
    if (!userDB) {
      throw new NotFoundError("Usuário não existe.");
    }

    //Verifica se o post não pertence ao próprio usuário.
    if (commentDB?.creator_id === userId) {
      throw new BadRequestError("Um usuário não pode reagir ao próprio comentário.");
    }

    const likeDB = await this.commentsDatabase.getLike(inputLikeDB);

    let output: PutLikeCommentOutputDTO = {
      message: "",
    };

    //Verifica se o usuário já possui uma reação ao comment.
    if (!likeDB) {
      //Caminho se for a primeira reação do usuário ao comment.
      await this.commentsDatabase.createLike(inputLikeDB);
      await this.commentsDatabase.addLikeInComment(inputLikeDB);
      output.message = "Seu Like/Dislike foi enviado!";
    } else {
      //Caminho para o caso de o usuário já possuir uma reação ao comment.
      //Verifica se o like/dislike é igual ao like/dislike já registrado para o comment.
      if (likeDB.like === like) {
        //Caminho para o caso de que o like enviado pelo usuário é igual ao like enviado anteriormente;
        //Deleta o like/dislike feito anteriormente pelo usuário.
        await this.commentsDatabase.deleteLike(inputLikeDB);
        //Decremento do like/dislike feito no comment anteriormente pelo usuário.
        await this.commentsDatabase.decreaseLikeInComment(inputLikeDB);
        output.message = "Seu Like/Dislike foi removido!";
      } else {
        //Caminho para o caso de que o like enviado pelo usuário é diferente do like enviado anteriormente.
        //Inverte o like no banco de dados (tabela de relações user x comment).
        await this.commentsDatabase.changeLike(inputLikeDB);
        //Converte like em dislike ou vice-versa no comment no banco de dados.
        await this.commentsDatabase.overwriteLikeInComment(inputLikeDB);
        output.message = "Seu Like/Dislike foi alterado!";
      }
    }
    return output;
  };

  public deleteComment = async (
    input: DeleteCommentInputDTO
  ): Promise<DeleteCommentOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const commentExists = await this.commentsDatabase.getCommentById(idToDelete);
    if (!commentExists) {
      throw new NotFoundError(
        "Não há um comentário correspondente para o 'id' informado."
      );
    }

    if (payload.id !== commentExists.creator_id && payload.role !== USER_ROLE.ADMIN) {
      throw new BadRequestError(
        "Somente o proprietário pode excluir seu próprio comentário."
      );
    }

    await this.commentsDatabase.deleteComment(idToDelete, commentExists.post_id);
    const output: DeleteCommentOutputDTO = {
      message: "Seu comentário foi excluído",
    };
    return output;
  };
}
