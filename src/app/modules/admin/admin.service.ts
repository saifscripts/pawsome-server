import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { Payment } from '../payment/payment.model';
import { Post } from '../post/post.model';
import { USER_ROLE, USER_STATUS } from '../user/user.constant';
import { User } from '../user/user.model';

const getPostsFromDB = async (query: Record<string, unknown>) => {
    const postQuery = new QueryBuilder(Post.find(), query)
        // .search(PostSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const posts = await postQuery.modelQuery;
    const meta = await postQuery.countTotal();

    return {
        statusCode: httpStatus.OK,
        message: 'Posts retrieved successfully',
        data: posts,
        meta,
    };
};

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

const publishPostIntoDB = async (id: string) => {
    const post = await Post.findById(id);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.isPublished) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Post is already published!',
        );
    }

    const result = await Post.findByIdAndUpdate(
        id,
        {
            isPublished: true,
        },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Post is published successfully!',
        data: result,
    };
};

const unpublishPostIntoDB = async (id: string) => {
    const post = await Post.findById(id);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (!post.isPublished) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Post is already unpublished!',
        );
    }

    const result = await Post.findByIdAndUpdate(
        id,
        {
            isPublished: false,
        },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Post is unpublished successfully!',
        data: result,
    };
};

const getPaymentsFromDB = async (query: Record<string, unknown>) => {
    const paymentQuery = new QueryBuilder(
        Payment.find().populate('user'),
        query,
    )
        // .search(PaymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const payments = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();

    return {
        statusCode: httpStatus.OK,
        message: 'Payments retrieved successfully',
        data: payments,
        meta,
    };
};

const deletePaymentFromDB = async (id: string) => {
    const payment = await Payment.findById(id);

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found!');
    }

    // delete the user
    const deletedPayment = await Payment.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );

    if (!deletedPayment) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete payment!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Payment deleted successfully',
        data: deletedPayment,
    };
};

export const AdminServices = {
    getPostsFromDB,
    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    blockUserIntoDB,
    unblockUserIntoDB,
    publishPostIntoDB,
    unpublishPostIntoDB,
    getPaymentsFromDB,
    deletePaymentFromDB,
};
