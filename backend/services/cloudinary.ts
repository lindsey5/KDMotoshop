import { v2 as cloudinary } from 'cloudinary';
import { UploadedImage } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (image: string): Promise<UploadedImage | null> => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'kd-motoshop',
    });

    return {
      imagePublicId: result.public_id,
      imageUrl: result.secure_url,
    };

  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return null;
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

export const uploadVideo = async (video: string): Promise<{ videoPublicId: string; videoUrl: string } | null> => {
  try {
    const result = await cloudinary.uploader.upload(video, {
      folder: 'kd-motoshop/videos',
      resource_type: 'video',
    });

    return {
      videoPublicId: result.public_id,
      videoUrl: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary video upload failed:', error);
    return null;
  }
};

export const deleteVideo = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    return result;
  } catch (error) {
    console.error('Cloudinary video deletion error:', error);
    throw error;
  }
};