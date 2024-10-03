import { RequestHandler } from 'express';
import httpStatus from 'http-status';

const notFound: RequestHandler = (_req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'Route Not Found',
    });
};

export default notFound;
