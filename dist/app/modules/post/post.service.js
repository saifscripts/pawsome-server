"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const post_model_1 = require("./post.model");
const createPostIntoDB = (authorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield post_model_1.Post.create(Object.assign(Object.assign({}, payload), { author: authorId }));
    return {
        statusCode: http_status_1.default.CREATED,
        message: 'Post created successfully',
        data: newPost,
    };
});
const getPostsFromDB = (decodedUser, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedUser === null || decodedUser === void 0 ? void 0 : decodedUser.id);
    const isPremiumUser = user &&
        (user === null || user === void 0 ? void 0 : user.userType) === user_constant_1.USER_TYPE.PREMIUM &&
        (user === null || user === void 0 ? void 0 : user.subscriptionEndDate) > new Date();
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    let posts = yield postQuery.modelQuery;
    if (!isPremiumUser) {
        posts = posts.map((post) => {
            var _a;
            if (post.isPremium) {
                return {
                    title: post.title,
                    content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.substring(0, 100)) + '...',
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    isPremium: true,
                };
            }
            return post;
        });
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
});
exports.PostServices = {
    createPostIntoDB,
    getPostsFromDB,
};
