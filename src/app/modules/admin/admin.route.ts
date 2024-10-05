import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { AdminControllers } from './admin.controller';

const router = express.Router();

router.route('/users/').get(auth(USER_ROLE.ADMIN), AdminControllers.getUsers);

router
    .route('/users/:id/delete')
    .delete(auth(USER_ROLE.ADMIN), AdminControllers.deleteUser);

router
    .route('/users/:id/make-admin')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.makeAdmin);

router
    .route('/users/:id/remove-admin')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.removeAdmin);

router
    .route('/users/:id/block')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.blockUser);

router
    .route('/users/:id/unblock')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.unblockUser);

router.route('/posts').get(auth(USER_ROLE.ADMIN), AdminControllers.getPosts);

router
    .route('/posts/:id/publish')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.publishPost);

router
    .route('/posts/:id/unpublish')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.unpublishPost);

router
    .route('/payments/')
    .get(auth(USER_ROLE.ADMIN), AdminControllers.getPayments);

router
    .route('/payments/:id')
    .delete(auth(USER_ROLE.ADMIN), AdminControllers.deletePayment);

export const AdminRoutes = router;
