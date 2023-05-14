export interface LikeDB {
    user_id: string,
    post_id: string,
    like: number
}
export interface CommentLikeDB {
    user_id: string,
    comment_id: string,
    like: number
}