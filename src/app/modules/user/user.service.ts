import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendMail } from '../../utils/sendMail';
import uploadImage from '../../utils/uploadImage';
import { replaceText } from '../payment/payment.utils';
import { CONTACT_FORM_MESSAGE, USER_ROLE, USER_STATUS } from './user.constant';
import { IContactUsOptions, IUser } from './user.interface';
import { User } from './user.model';

const getUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const users = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();

    return {
        statusCode: httpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    };
};

const deleteUserFromDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // TODO:check other conditions for not deleting

    // delete the user
    const deletedUser = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );

    if (!deletedUser) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete user!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'User deleted successfully',
        data: deletedUser,
    };
};

const makeAdminIntoDB = async (id: string) => {
    const user = await User.findById(id);

    // check if the user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the user is blocked
    if (user.status === USER_STATUS.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
    }

    if (user.role === USER_ROLE.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is already an admin!');
    }

    const result = await User.findByIdAndUpdate(
        id,
        { role: USER_ROLE.ADMIN },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully!',
        data: result,
    };
};

const removeAdminFromDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.role !== USER_ROLE.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is not an admin!');
    }

    const result = await User.findByIdAndUpdate(
        id,
        { role: USER_ROLE.USER },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully!',
        data: result,
    };
};

const blockUserIntoDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.status === USER_STATUS.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is already blocked!');
    }

    const result = await User.findByIdAndUpdate(
        id,
        {
            status: USER_STATUS.BLOCKED,
        },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User is blocked successfully!',
        data: result,
    };
};

const unblockUserIntoDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.status === USER_STATUS.ACTIVE) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User is already unblocked!',
        );
    }

    const result = await User.findByIdAndUpdate(
        id,
        {
            status: USER_STATUS.ACTIVE,
        },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User is unblocked successfully!',
        data: result,
    };
};

const followUserIntoDB = async (userId: string, followingId: string) => {
    if (userId === followingId) {
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

const unfollowUserFromDB = async (userId: string, followingId: string) => {
    if (userId === followingId) {
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

const getProfileFromDB = async (id: string) => {
    const user = await User.findById(id);

    return {
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
};

const updateProfileIntoDB = async (id: string, payload: Partial<IUser>) => {
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

const updateAvatar = async (id: string, image: { buffer: Buffer }) => {
    if (!image) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Avatar is required');
    }

    const avatarURL = await uploadImage(image.buffer, id, 'avatar');

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
    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    blockUserIntoDB,
    unblockUserIntoDB,
    followUserIntoDB,
    unfollowUserFromDB,
    getProfileFromDB,
    updateProfileIntoDB,
    contactUsViaMail,
    updateAvatar,
};
