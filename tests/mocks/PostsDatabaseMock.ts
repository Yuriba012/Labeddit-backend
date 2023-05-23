import { InputLikeDB } from "../../src/types/InputLikeDB";
import { LikeDB } from "../../src/types/LikeDB";
import {
  EditedPostToDB,
  PostInputDB,
  PostOutputDB,
  PostRawDB,
} from "../../src/types/PostDB";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock } from "./UsersDatabaseMock";
import { UserDB } from "../../src/types/UserDB";

export const postsMock = [
  {
    id: "p001",
    creator_id: "u001",
    content: "post de user1",
    likes: 0,
    dislikes: 0,
    comments: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
  {
    id: "p002",
    creator_id: "u002",
    content: "post de user2",
    likes: 0,
    dislikes: 0,
    comments: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
  {
    id: "p003",
    creator_id: "u003",
    content: "post de user3",
    likes: 0,
    dislikes: 0,
    comments: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  }
];

const likesTable = [
  {
    user_id: "u001",
    post_id: "p002",
    like: 1,
  },
];

export class PostsDatabaseMock extends BaseDatabase {

  public getPosts = async (
    query: string | undefined
  ): Promise<PostOutputDB[] | undefined> => {
    let postsDB: PostOutputDB[];

    if(query){
      const result: PostOutputDB[] = postsMock.map((post) => {
        const user = usersMock.find((user) => user.id === post.creator_id);
        return {
          id: post.id,
          content: post.content,
          likes: post.likes,
          dislikes: post.dislikes,
          comments: post.comments,
          created_at: post.created_at,
          updated_at: post.updated_at,
          creator_id: post.creator_id,
          name: user?.name as string,
        };
      }).filter((post)=>post.content.includes(query));
      postsDB = result;
    }else{
      const result: PostOutputDB[] = postsMock.map((post) => {
        const user = usersMock.find((user) => user.id === post.creator_id);
        return {
          id: post.id,
          content: post.content,
          likes: post.likes,
          dislikes: post.dislikes,
          comments: post.comments,
          created_at: post.created_at,
          updated_at: post.updated_at,
          creator_id: post.creator_id,
          name: user?.name as string,
        };
      });
      postsDB = result;
    }

    return(postsDB.length === 0? undefined : postsDB)
  };

  public createPost = async (newPost: PostInputDB): Promise<void> => {};

  public getPostByIdOutputForm = async (
    id: string
  ): Promise<PostOutputDB | undefined> => {
    let postDB: PostOutputDB;

    const foundPost = postsMock.find((post) => post.id === id) as
      | PostRawDB
      | undefined;

    if (!foundPost) {
      return undefined;
    }

    const user = usersMock.find((user) => user.id === foundPost.creator_id) as
      | UserDB
      | undefined;

    postDB = {
      id: foundPost.id,
      content: foundPost.content,
      likes: foundPost.likes,
      dislikes: foundPost.dislikes,
      comments: foundPost.comments,
      created_at: foundPost.created_at,
      updated_at: foundPost.updated_at,
      creator_id: foundPost.creator_id,
      name: user?.name as string,
    };

    return postDB;
  };

  public getPostByIdDBForm = async (
    id: string
  ): Promise<PostRawDB | undefined> => {
    let postDB: PostRawDB | undefined;

    const foundPost = postsMock.find((post) => post.id === id) as
      | PostRawDB
      | undefined;

    if (!foundPost) {
      return undefined;
    }

    postDB = {
      id: foundPost.id,
      content: foundPost.content,
      likes: foundPost.likes,
      dislikes: foundPost.dislikes,
      comments: foundPost.comments,
      created_at: foundPost.created_at,
      updated_at: foundPost.updated_at,
      creator_id: foundPost.creator_id,
    };

    return postDB;
  };

  public editPost = async (input: EditedPostToDB): Promise<void> => {

  };

  public getLike = async (
    input: InputLikeDB
  ): Promise<InputLikeDB | undefined> => {
    const { userId, postId } = input;

    let output: InputLikeDB | undefined;

    const likeDB: LikeDB | undefined = likesTable.find(
      (like) => like.user_id === userId && like.post_id === postId
    );

    if (!likeDB) {
      output = likeDB;
    } else {
      output = {
        userId: likeDB.user_id,
        postId: likeDB.post_id,
        like: !!likeDB.like,
      };
    }
    return output;
  };

  public createLike = async (input: InputLikeDB): Promise<void> => {

  };

  public addLikeInPost = async (input: InputLikeDB): Promise<void> => {

  };

  public deleteLike = async (input: InputLikeDB): Promise<void> => {

  };

  public decreaseLikeInPost = async (input: InputLikeDB): Promise<void> => {
   
  }

  public changeLike = async (input: InputLikeDB): Promise<void> => {

  };

  public overwriteLikeInPost = async (input: InputLikeDB): Promise<void> => {

  };

  public deletePost = async (idToDelete: string): Promise<void> => {

  };
}
