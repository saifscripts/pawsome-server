import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(AuthValidations.signupValidationSchema),
    AuthControllers.signup,
);

router.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login,
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

router.put(
    '/change-password',
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    '/forget-password',
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
);

router.put(
    '/reset-password',
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;
