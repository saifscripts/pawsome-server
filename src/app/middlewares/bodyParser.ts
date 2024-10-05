import { RequestHandler } from 'express';

// parse the body if the data is sent as form-data
export const bodyParser: RequestHandler = (req, _res, next) => {
    req.body = req.body.data ? JSON.parse(req.body.data) : req.body;

    next();
};
