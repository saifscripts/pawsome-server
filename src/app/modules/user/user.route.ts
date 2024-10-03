import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.route('/').get(auth(USER_ROLE.ADMIN), UserControllers.getUsers);
router.route('/:id').delete(auth(USER_ROLE.ADMIN), UserControllers.deleteUser);

router
    .route('/:id/make-admin')
    .put(auth(USER_ROLE.ADMIN), UserControllers.makeAdmin);

router
    .route('/:id/remove-admin')
    .put(auth(USER_ROLE.ADMIN), UserControllers.removeAdmin);

router
    .route('/me')
    .get(auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.getProfile)
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
