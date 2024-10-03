import mongoose from 'mongoose';
import { PostCategories } from './post.constant';

export type IPostCategory = (typeof PostCategories)[number];

interface IPost {
    // title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    category: IPostCategory;
    imageUrls?: string[];
    upvotes: [mongoose.Types.ObjectId];
    downvotes: [mongoose.Types.ObjectId];
    // comments: string[];
    isPremium: boolean;
    isPublished: boolean;
    isDeleted: boolean;
}

export default IPost;
