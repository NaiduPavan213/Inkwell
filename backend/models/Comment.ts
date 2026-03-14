import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    text: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    authorUsername: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    authorUsername: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Optimization: Indexing
CommentSchema.index({ post: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);
