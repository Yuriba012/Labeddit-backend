export interface CommentOutputDB {
    id: string;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updated_at: string;
    post_id: string;
    creator_id: string;
    name: string;
}
export interface CommentInputDB {
    id: string;
    creator_id: string;
    post_id: string;
    content: string;
    created_at: string;
}

export interface EditedCommentToDB {
    idToEdit: string,
    newComment: {
      content: string,
      updated_at: string
    };
}