import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
}

const LikeSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

// Ensure a user can only like a post once
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
