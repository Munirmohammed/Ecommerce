import { cloudinary } from '@/config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export const uploadImage = async (
    file: Express.Multer.File
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'ecommerce/products',
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto' },
                ],
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Upload failed'));
                resolve(result);
            }
        );

        uploadStream.end(file.buffer);
    });
};

export const deleteImage = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
    }
};
