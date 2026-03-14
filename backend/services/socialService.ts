import Comment from '../models/Comment';
import Like from '../models/Like';
import User from '../models/User';

export class SocialService {
    /**
     * Add a comment to a post
     */
    static async addComment(postId: string, userId: string, text: string) {
        const user = await User.findById(userId).lean();
        if (!user) throw new Error('User not found');

        const newComment = new Comment({
            text,
            author: userId,
            post: postId,
            authorUsername: user.username
        });
        return await newComment.save();
    }

    /**
     * Get comments for a post
     */
    static async getComments(postId: string) {
        return await Comment.find({ post: postId }).sort({ createdAt: 'desc' }).lean();
    }

    /**
     * Toggle like/unlike on a post
     */
    static async toggleLike(postId: string, userId: string) {
        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            await existingLike.deleteOne();
            return { msg: 'Post unliked', liked: false };
        } else {
            const newLike = new Like({ post: postId, user: userId });
            await newLike.save();
            return { msg: 'Post liked', liked: true };
        }
    }

    /**
     * Get likes for a post
     */
    static async getLikes(postId: string) {
        return await Like.find({ post: postId }).lean();
    }
}
