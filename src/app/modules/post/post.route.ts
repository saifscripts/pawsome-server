import express from 'express';
import auth from '../../middlewares/auth';
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
        validateRequest(PostValidations.createPostValidationSchema),
        PostControllers.createPost,
    );

router.route('/:id').get(verifyToken, PostControllers.getPost);

export const PostRoutes = router;
