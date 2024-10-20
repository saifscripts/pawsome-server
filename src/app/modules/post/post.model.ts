import { Schema, model } from 'mongoose';
import { PostCategories } from './post.constant';
import IPost from './post.interface';

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        summary: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, enum: PostCategories, required: true },
        tags: [{ type: String }],
        featuredImage: { type: String, required: true },
        upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        totalVotes: { type: Number, default: 0 },
        totalComments: { type: Number, default: 0 },
        isPremium: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// Query Middlewares
PostSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

PostSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }

    this.find({ isDeleted: { $ne: true } });
    next();
});

PostSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

// Update totalVotes and totalComments before saving the post
PostSchema.pre('save', function (next) {
    this.totalVotes = this.upvotes.length - this.downvotes.length;
    this.totalComments = this.comments.length;
    next();
});

export const Post = model<IPost>('Post', PostSchema);
