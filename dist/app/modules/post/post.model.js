"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const post_constant_1 = require("./post.constant");
const PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: post_constant_1.PostCategories, required: true },
    imageUrls: [{ type: String }],
    upvotes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }],
    isPremium: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
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
exports.Post = (0, mongoose_1.model)('Post', PostSchema);