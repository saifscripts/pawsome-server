import mongoose from 'mongoose';
import { PostCategories } from './post.constant';

export type IPostCategory = (typeof PostCategories)[number];

interface IPost {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    category: IPostCategory;
    imageUrls?: string[];
    upvotes: [mongoose.Types.ObjectId];
    downvotes: [mongoose.Types.ObjectId];
    comments: [mongoose.Types.ObjectId];
    isPremium: boolean;
    isPublished: boolean;
    isDeleted: boolean;
}

export default IPost;
