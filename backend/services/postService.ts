import Post from '../models/Post';

export class PostService {
    /**
     * Create a new post
     */
    static async createPost(postData: any, userId: string) {
        const { title, content } = postData;
        const newPost = new Post({
            title,
            content,
            author: userId
        });
        return await newPost.save();
    }

    /**
     * Get all posts sorted by newest
     */
    static async getAllPosts() {
        return await Post.find().sort({ createdAt: -1 }).lean();
    }

    /**
     * Get a single post by ID
     */
    static async getPostById(postId: string) {
        const post = await Post.findById(postId).lean();
        if (!post) throw new Error('Post not found');
        return post;
    }

    /**
     * Update a post (checking authorship)
     */
    static async updatePost(postId: string, updateData: any, userId: string) {
        const post = await Post.findById(postId);
        if (!post) throw new Error('Post not found');

        // Check author
        if (post.author.toString() !== userId) {
            throw new Error('Not authorized');
        }

        return await Post.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true }
        );
    }

    /**
     * Delete a post (checking authorship)
     */
    static async deletePost(postId: string, userId: string) {
        const post = await Post.findById(postId);
        if (!post) throw new Error('Post not found');

        // Check author
        if (post.author.toString() !== userId) {
            throw new Error('Not authorized');
        }

        await post.deleteOne();
        return { msg: 'Post removed successfully' };
    }
}
