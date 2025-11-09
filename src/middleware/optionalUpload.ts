import { Request, Response, NextFunction } from 'express';
import { upload } from './upload';

// middleware that handles both JSON and multipart form data
export const optionalImageUpload = (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'] || '';

    // if it's multipart form data, use multer
    if (contentType.includes('multipart/form-data')) {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return next(err);
            }
            next();
        });
    } else {
        // for JSON requests, just continue
        next();
    }
};
