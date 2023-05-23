import {
  CommentInputDB,
  CommentOutputDB,
  EditedCommentToDB,
} from "../../src/types/Comment";
import { InputCommentLikeDB } from "../../src/types/InputLikeDB";
import { CommentLikeDB } from "../../src/types/LikeDB";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock } from "./UsersDatabaseMock";

const commentsMock = [
  {
    id: "c001",
    creator_id: "u001",
    post_id: "p001",
    content: "comentário de user1",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
  {
    id: "c002",
    creator_id: "u002",
    post_id: "p002",
    content: "comentário de user2",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
  {
    id: "c003",
    creator_id: "u003",
    post_id: "p003",
    content: "comentário de user3",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
];

const commentsLikesTable = [
  {
    user_id: "u001",
    comment_id: "c002",
    like: 1,
  },
];

export class CommentsDatabaseMock extends BaseDatabase {

  public getComments = async (
    postId: string
  ): Promise<CommentOutputDB[] | undefined> => {
    const commentsDB = commentsMock.filter((comment)=>comment.post_id === postId)


    const result: CommentOutputDB[] = commentsDB.map((commentDB) => {
      const user = usersMock.find((user) => user.id === commentDB.creator_id);
      return {
        id: commentDB.id,
        content: commentDB.content,
        likes: commentDB.likes,
        dislikes: commentDB.dislikes,
        created_at: commentDB.created_at,
        updated_at: commentDB.updated_at,
        post_id: commentDB.post_id,
        creator_id: commentDB.creator_id,
        name: user?.name as string,
      };
    });

    return result;
  };
  public createComment = async (newComment: CommentInputDB): Promise<void> => {

  };

  public getCommentById = async (
    commentId: string
  ): Promise<CommentOutputDB | undefined> => {

    const commentDB = commentsMock.find((comment)=>comment.id===commentId)

    if(!commentDB){
      return undefined
    }

    const user = usersMock.find((user) => user.id === commentDB.creator_id);

    const commentOutput: CommentOutputDB = {
        id: commentDB.id,
        content: commentDB.content,
        likes: commentDB.likes,
        dislikes: commentDB.dislikes,
        created_at: commentDB.created_at,
        updated_at: commentDB.updated_at,
        post_id: commentDB.post_id,
        creator_id: commentDB.creator_id,
        name: user?.name as string,
      };

    return commentOutput;
  };

  public editComment = async (input: EditedCommentToDB): Promise<void> => {

  };

  public getLike = async (
    input: InputCommentLikeDB
  ): Promise<InputCommentLikeDB | undefined> => {
    const { userId, commentId } = input;

    let output: InputCommentLikeDB | undefined;

    const likeDB: CommentLikeDB | undefined = commentsLikesTable.find(
      (like) => like.user_id === userId && like.comment_id === commentId
    );
    
    if (!likeDB) {
      output = likeDB;
    } else {
      output = {
        userId: likeDB.user_id,
        commentId: likeDB.comment_id,
        like: !!likeDB.like,
      };
    }
    return output;
  };

  public createLike = async (input: InputCommentLikeDB): Promise<void> => {

  };

  public addLikeInComment = async (
    input: InputCommentLikeDB
  ): Promise<void> => {

  };

  public deleteLike = async (input: InputCommentLikeDB): Promise<void> => {

  };

  public decreaseLikeInComment = async (
    input: InputCommentLikeDB
  ): Promise<void> => {

  };

  public changeLike = async (input: InputCommentLikeDB): Promise<void> => {

  };

  public overwriteLikeInComment = async (
    input: InputCommentLikeDB
  ): Promise<void> => {

  };
  public deleteComment = async (idToDelete: string, postId: string): Promise<void> => {

  };
}
