import {
  CommentInputDB,
  CommentOutputDB,
  EditedCommentToDB,
} from "../types/Comment";
import { InputCommentLikeDB } from "../types/InputLikeDB";
import { CommentLikeDB } from "../types/LikeDB";
import { BaseDatabase } from "./BaseDatabase";

export class CommentsDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_COMMENTS_LIKES = "comments_likes";
  public static TABLE_POSTS = "posts";
  public static TABLE_USERS = "users";

  public getComments = async (
    postId: string
  ): Promise<CommentOutputDB[] | undefined> => {
    const commentsDB: CommentOutputDB[] | undefined =
      await BaseDatabase.connection
        .select(
          "comments.id",
          "comments.content",
          "comments.likes",
          "comments.dislikes",
          "comments.created_at",
          "comments.updated_at",
          "comments.post_id",
          "comments.creator_id",
          "users.name"
        )
        .from(CommentsDatabase.TABLE_COMMENTS)
        .leftJoin(CommentsDatabase.TABLE_USERS, (comment_user) => {
          comment_user.on("comments.creator_id", "=", "users.id");
        })
        .where({ post_id: postId });
    return commentsDB;
  };
  public createComment = async (newComment: CommentInputDB): Promise<void> => {
    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS).insert(
      newComment
    );
    let [commentsAmount] = await BaseDatabase.connection
    .select("comments")
    .from(CommentsDatabase.TABLE_POSTS)
    .where({ id: newComment.post_id });

    commentsAmount.comments++;

      await BaseDatabase.connection(CommentsDatabase.TABLE_POSTS)
        .update({ comments: commentsAmount.comments })
        .where({ id: newComment.post_id });
  };

  public getCommentById = async (
    commentId: string
  ): Promise<CommentOutputDB | undefined> => {
    const [commentDB]: CommentOutputDB[] | undefined =
    await BaseDatabase.connection
    .select(
      "comments.id",
      "comments.content",
      "comments.likes",
      "comments.dislikes",
      "comments.created_at",
      "comments.updated_at",
      "comments.post_id",
      "comments.creator_id",
      "users.name"
    )
    .from(CommentsDatabase.TABLE_COMMENTS)
    .leftJoin(CommentsDatabase.TABLE_USERS, (comment_user) => {
      comment_user.on("comments.creator_id", "=", "users.id");
    })
    .where("comments.id", "=", commentId);

    return commentDB;
  };

  public editComment = async (input: EditedCommentToDB): Promise<void> => {
    const { idToEdit, newComment } = input;

    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
      .update(newComment)
      .where({ id: idToEdit });
  };

  public getLike = async (
    userId: string, commentId: string
  ): Promise<InputCommentLikeDB | undefined> => {

    let output: InputCommentLikeDB | undefined;

    const [likeDB]: CommentLikeDB[] | undefined = await BaseDatabase.connection(
      CommentsDatabase.TABLE_COMMENTS_LIKES
    ).where({ user_id: userId, comment_id: commentId });
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
    const { userId, commentId, like } = input;

    const likeDB: CommentLikeDB = {
      user_id: userId,
      comment_id: commentId,
      like: +like,
    };

    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS_LIKES).insert(
      likeDB
    );
  };

  public addLikeInComment = async (
    input: InputCommentLikeDB
  ): Promise<void> => {
    const { commentId, like } = input;

    if (like) {
      let [likesAmount] = await BaseDatabase.connection
        .select("likes")
        .from(CommentsDatabase.TABLE_COMMENTS)
        .where({ id: commentId });

      likesAmount.likes++;

      await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
        .update({ likes: likesAmount.likes })
        .where({ id: commentId });
    } else {
      let [dislikesAmount] = await BaseDatabase.connection
        .select("dislikes")
        .from(CommentsDatabase.TABLE_COMMENTS)
        .where({ id: commentId });

      dislikesAmount.dislikes++;

      await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
        .update({ dislikes: dislikesAmount.dislikes })
        .where({ id: commentId });
    }
  };

  public deleteLike = async (input: InputCommentLikeDB): Promise<void> => {
    const { userId, commentId } = input;

    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS_LIKES)
      .delete()
      .where({ user_id: userId, comment_id: commentId });
  };

  public decreaseLikeInComment = async (
    input: InputCommentLikeDB
  ): Promise<void> => {
    const { commentId, like } = input;

    if (like) {
      let [likesAmount] = await BaseDatabase.connection
        .select("likes")
        .from(CommentsDatabase.TABLE_COMMENTS)
        .where({ id: commentId });

      likesAmount.likes--;

      await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
        .update({ likes: likesAmount.likes })
        .where({ id: commentId });
    } else {
      let [dislikesAmount] = await BaseDatabase.connection
        .select("dislikes")
        .from(CommentsDatabase.TABLE_COMMENTS)
        .where({ id: commentId });

      dislikesAmount.dislikes--;

      await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
        .update({ dislikes: dislikesAmount.dislikes })
        .where({ id: commentId });
    }
  };

  public changeLike = async (input: InputCommentLikeDB): Promise<void> => {
    const { userId, commentId, like } = input;

    const newLike = +like;

    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS_LIKES)
      .update({ like: newLike })
      .where({ user_id: userId, comment_id: commentId });
  };

  public overwriteLikeInComment = async (
    input: InputCommentLikeDB
  ): Promise<void> => {
    const { commentId, like } = input;

    if (like) {
      let [amount] = await BaseDatabase.connection
        .select("likes", "dislikes")
        .from(CommentsDatabase.TABLE_COMMENTS)
        .where({ id: commentId });

      amount.likes++;
      amount.dislikes--;

      await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
        .update({ likes: amount.likes, dislikes: amount.dislikes })
        .where({ id: commentId });
    } else {
      let [amount] = await BaseDatabase.connection
        .select("likes", "dislikes")
        .from(CommentsDatabase.TABLE_COMMENTS)
        .where({ id: commentId });

      amount.likes--;
      amount.dislikes++;

      await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
        .update({ likes: amount.likes, dislikes: amount.dislikes })
        .where({ id: commentId });
    }
  };
  public deleteComment = async (idToDelete: string, post_id: string): Promise<void> => {

    let [commentsAmount] = await BaseDatabase.connection
    .select("comments")
    .from(CommentsDatabase.TABLE_POSTS)
    .where({ id: post_id });

    commentsAmount.comments--;

      await BaseDatabase.connection(CommentsDatabase.TABLE_POSTS)
        .update({ comments: commentsAmount.comments })
        .where({ id: post_id });

    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id: idToDelete });
  };
}
