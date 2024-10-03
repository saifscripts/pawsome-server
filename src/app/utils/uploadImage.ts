import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import config from '../config';

cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

export default async function uploadImage(
    buffer: Buffer,
    publicId: string,
    folder?: string,
) {
    return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                public_id: publicId,
            },
            function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result?.secure_url);
            },
        );

        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
    });
}
