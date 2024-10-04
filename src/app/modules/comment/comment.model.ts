import mongoose, { Schema, model } from 'mongoose';
import { IComment } from './comment.interface';

const CommentSchema = new Schema<IComment>(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// Query Middlewares
CommentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

CommentSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }

    this.find({ isDeleted: { $ne: true } });
    next();
});

CommentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Comment = model<IComment>('Comment', CommentSchema);
