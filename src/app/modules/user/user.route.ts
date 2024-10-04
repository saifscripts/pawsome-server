import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.route('/:id').get(UserControllers.getUser);

router
    .route('/:id/follow')
    .put(auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.followUser);

router
    .route('/:id/unfollow')
    .put(auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.unfollowUser);

router
    .route('/me')
    .get(auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.getMe)
    .put(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        validateRequest(UserValidations.updateProfileValidationSchema),
        UserControllers.updateProfile,
    );

router
    .route('/avatar')
    .post(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        upload.single('avatar'),
        UserControllers.updateAvatar,
    );

router
    .route('/contact-us')
    .post(
        validateRequest(UserValidations.contactUsValidationSchema),
        UserControllers.contactUs,
    );

export const UserRoutes = router;
