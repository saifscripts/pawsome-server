"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = void 0;
// parse the body if the data is sent as form-data
const bodyParser = (req, _res, next) => {
    req.body = req.body.data ? JSON.parse(req.body.data) : req.body;
    next();
};
exports.bodyParser = bodyParser;
