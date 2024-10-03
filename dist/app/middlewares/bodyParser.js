"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = void 0;
// parse the body if the data is sent as form-data
const bodyParser = (req, _res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
};
exports.bodyParser = bodyParser;
