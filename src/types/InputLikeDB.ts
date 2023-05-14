export interface InputLikeDB {
    userId: string,
    postId: string,
    like: boolean
}

export interface InputCommentLikeDB {
    userId: string,
    commentId: string,
    like: boolean
}