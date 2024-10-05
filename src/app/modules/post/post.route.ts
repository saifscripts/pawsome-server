import express from 'express';
import auth from '../../middlewares/auth';
import { bodyParser } from '../../middlewares/bodyParser';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import verifyToken from '../../middlewares/verifyToken';
import { USER_ROLE } from '../user/user.constant';
import { PostControllers } from './post.controller';
import { PostValidations } from './post.validation';

const router = express.Router();

router
    .route('/')
    .get(verifyToken, PostControllers.getPosts)
    .post(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        upload.array('images'),
        bodyParser,
        validateRequest(PostValidations.createPostValidationSchema),
        PostControllers.createPost,
    );

router
    .route('/:id')
    .get(verifyToken, PostControllers.getPost)
    .put(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        upload.array('images'),
        bodyParser,
        validateRequest(PostValidations.updatePostValidationSchema),
        PostControllers.updatePost,
    )
    .delete(auth(USER_ROLE.ADMIN, USER_ROLE.USER), PostControllers.deletePost);

router.put(
    '/:id/upvote',
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    PostControllers.upvotePost,
);

router.put(
    '/:id/downvote',
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    PostControllers.downvotePost,
);

export const PostRoutes = router;
