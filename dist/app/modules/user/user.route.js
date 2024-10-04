"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router
    .route('/me')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), user_controller_1.UserControllers.getMe)
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(user_validation_1.UserValidations.updateProfileValidationSchema), user_controller_1.UserControllers.updateProfile);
router
    .route('/avatar')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), upload_1.upload.single('avatar'), user_controller_1.UserControllers.updateAvatar);
router
    .route('/contact-us')
    .post((0, validateRequest_1.default)(user_validation_1.UserValidations.contactUsValidationSchema), user_controller_1.UserControllers.contactUs);
router.route('/:id').get(user_controller_1.UserControllers.getUser);
router
    .route('/:id/follow')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), user_controller_1.UserControllers.followUser);
router
    .route('/:id/unfollow')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), user_controller_1.UserControllers.unfollowUser);
exports.UserRoutes = router;
