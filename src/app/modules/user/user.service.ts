import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendMail } from '../../utils/sendMail';
import { replaceText } from '../payment/payment.utils';
import { CONTACT_FORM_MESSAGE, USER_STATUS } from './user.constant';
import { IContactUsOptions, IUser } from './user.interface';
import { User } from './user.model';

const getUserFromDB = async (id: string) => {
    const user = await User.findById(id)
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: { path: 'author', select: 'name email avatarURL' },
            },
        })
        .populate('followers')
        .populate('following');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'User retrieved successfully',
        data: {
            ...user.toObject(),
            role: undefined,
            status: undefined,
            userType: undefined,
            createdAt: undefined,
            updatedAt: undefined,
        },
    };
};

const followUserIntoDB = async (
    userId: mongoose.Types.ObjectId,
    followingId: string,
) => {
    if (userId.toString() === followingId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You can't follow yourself!",
        );
    }

    const followingUser = await User.findById(followingId);

    if (!followingUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (followingUser.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (followingUser.status === USER_STATUS.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
    }

    if (
        followingUser?.followers.includes(new mongoose.Types.ObjectId(userId))
    ) {
        throw new AppError(
            httpStatus.CONFLICT,
            'You already followed the user!',
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { following: followingId } },
            { new: true, session },
        );

        if (!updatedUser) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to follow the user!',
            );
        }

        const updatedFollowingUser = await User.findByIdAndUpdate(
            followingId,
            { $addToSet: { followers: userId } },
            { new: true, session },
        );

        if (!updatedFollowingUser) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to follow the user!',
            );
        }

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.OK,
            message: 'User is followed successfully!',
            data: updatedUser,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const unfollowUserFromDB = async (
    userId: mongoose.Types.ObjectId,
    followingId: string,
) => {
    if (userId.toString() === followingId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You can't follow/unfollow yourself!",
        );
    }

    const followingUser = await User.findById(followingId);

    if (
        !followingUser?.followers?.includes?.(
            new mongoose.Types.ObjectId(userId),
        )
    ) {
        throw new AppError(
            httpStatus.CONFLICT,
            "You didn't followed the user!",
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { following: followingId } },
            { new: true, session },
        );

        if (!updatedUser) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to unfollow the user!',
            );
        }

        const updatedFollowingUser = await User.findByIdAndUpdate(
            followingId,
            { $pull: { followers: userId } },
            { new: true, session },
        );

        if (!updatedFollowingUser) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to unfollow the user!',
            );
        }

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.OK,
            message: 'User is unfollowed successfully!',
            data: updatedUser,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getMeFromDB = async (id: mongoose.Types.ObjectId) => {
    const user = await User.findById(id);

    return {
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
};

const updateProfileIntoDB = async (
    id: mongoose.Types.ObjectId,
    payload: Partial<IUser>,
) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return {
        statusCode: httpStatus.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
};

const contactUsViaMail = async (payload: IContactUsOptions) => {
    const emailBody = replaceText(CONTACT_FORM_MESSAGE, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
    });

    const result = await sendMail({
        from: payload.email,
        to: config.mail_auth_user!,
        subject: `Contact Us Form Submission from ${payload.name}`,
        html: emailBody,
    });

    if (!result.messageId) {
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            'Fail to send email!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Email sent successfully',
        data: null,
    };
};

const updateAvatar = async (
    id: mongoose.Types.ObjectId,
    avatarURL?: string,
) => {
    if (!avatarURL) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Avatar is required');
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { avatarURL },
        {
            new: true,
        },
    );

    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Avatar uploaded successfully',
        data: updatedUser,
    };
};

export const UserServices = {
    getUserFromDB,
    followUserIntoDB,
    unfollowUserFromDB,
    getMeFromDB,
    updateProfileIntoDB,
    contactUsViaMail,
    updateAvatar,
};
