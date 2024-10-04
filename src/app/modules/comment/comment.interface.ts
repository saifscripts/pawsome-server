import mongoose from 'mongoose';

export interface IComment {
    _id?: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    isDeleted?: boolean;
}
