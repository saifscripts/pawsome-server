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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    avatarURL: { type: String, required: false },
    role: {
        type: String,
        required: true,
        enum: user_constant_1.UserRoles,
        default: user_constant_1.USER_ROLE.USER,
    },
    status: {
        type: String,
        required: true,
        enum: user_constant_1.UserStatus,
        default: user_constant_1.USER_STATUS.ACTIVE,
    },
    userType: {
        type: String,
        required: true,
        enum: user_constant_1.UserType,
        default: user_constant_1.USER_TYPE.BASIC,
    },
    subscription: {
        startDate: Date,
        endDate: Date,
    },
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
UserSchema.post('save', function (doc, next) {
    doc.password = undefined;
    next();
});
UserSchema.statics.comparePassword = function (plain, hashed) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plain, hashed);
    });
};
// Query Middlewares
UserSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
UserSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
UserSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
