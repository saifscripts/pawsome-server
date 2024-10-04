import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { CommentControllers } from './comment.controller';
import { CommentValidations } from './comment.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        validateRequest(CommentValidations.createCommentValidationSchema),
        CommentControllers.createComment,
    );

router
    .route('/:id')
    .put(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        validateRequest(CommentValidations.updateCommentValidationSchema),
        CommentControllers.updateComment,
    )
    .delete(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        CommentControllers.deleteComment,
    );

export const CommentRoutes = router;
