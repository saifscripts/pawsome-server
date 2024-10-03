"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    base_url: process.env.BASE_URL,
    client_base_url: process.env.CLIENT_BASE_URL,
    port: process.env.PORT,
    db_uri: process.env.DB_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_exp_in: process.env.JWT_ACCESS_EXP_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_exp_in: process.env.JWT_REFRESH_EXP_IN,
    jwt_reset_secret: process.env.JWT_RESET_SECRET,
    jwt_reset_exp_in: process.env.JWT_RESET_EXP_IN,
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    payment_base_url: process.env.PAYMENT_BASE_URL,
    mail_auth_user: process.env.MAIL_AUTH_USER,
    mail_auth_pass: process.env.MAIL_AUTH_PASS,
    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
