"use server";

import { PrismaClient } from '../../generated/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure Cloudinary - Use server-side env vars (without NEXT_PUBLIC_)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Types for car data
interface CarData {
  name: string;
  type: string;
  transmission: string;
  seats: number;
  fuelType: string;
  perDayCharge: number;
  description?: string;
  mileage?: number;
  year?: number;
  color?: string;
  features?: string[];
}

interface PhotoFile {
  name: string;
  type: string;
  size: number;
  base64: string; // Changed from arrayBuffer to base64
}

// Upload single photo to Cloudinary with optimization
async function uploadPhotoToCloudinary(file: PhotoFile): Promise<string> {
  try {
    // Convert base64 to buffer
    const base64Data = file.base64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'car-rentals',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto:good' }, // Better quality optimization
            { fetch_format: 'auto' } // Auto format (WebP for supported browsers)
          ],
          eager: [
            { width: 400, height: 300, crop: 'fill', quality: 'auto:good' },
            { width: 200, height: 150, crop: 'fill', quality: 'auto:good' }
          ],
          eager_async: true
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return (result as any).secure_url;
  } catch (error) {
    throw new Error(`Failed to upload photo ${file.name}: ${error}`);
  }
}

// Validate car data
function validateCarData(data: CarData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Car name must be at least 2 characters long');
  }

  if (!data.type || data.type.trim().length === 0) {
    errors.push('Car type is required');
  }

  if (!data.transmission || data.transmission.trim().length === 0) {
    errors.push('Transmission type is required');
  }

  if (!data.seats || data.seats < 1 || data.seats > 20) {
    errors.push('Number of seats must be between 1 and 20');
  }

  if (!data.fuelType || data.fuelType.trim().length === 0) {
    errors.push('Fuel type is required');
  }

  if (!data.perDayCharge || data.perDayCharge <= 0) {
    errors.push('Per day charge must be greater than 0');
  }

  if (data.mileage && data.mileage < 0) {
    errors.push('Mileage cannot be negative');
  }

  if (data.year && (data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
    errors.push('Invalid year');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Main function to add car with photos
export async function addCar(
  carData: CarData,
  photos: PhotoFile[]
): Promise<{ success: boolean; message: string; carId?: string; errors?: string[] }> {
  try {
    // Debug: Check if env vars are loaded
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Found' : 'Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Found' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Found' : 'Missing'
    });

    // Validate car data
    const validation = validateCarData(carData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    // Validate photos
    if (!photos || photos.length === 0) {
      return {
        success: false,
        message: 'At least one photo is required',
        errors: ['Please upload at least one photo']
      };
    }

    if (photos.length > 5) {
      return {
        success: false,
        message: 'Too many photos',
        errors: ['Maximum 5 photos allowed']
      };
    }

    // Validate photo files
    const validPhotoTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const photo of photos) {
      if (!validPhotoTypes.includes(photo.type)) {
        return {
          success: false,
          message: 'Invalid photo format',
          errors: [`Photo ${photo.name} has invalid format. Only JPEG, PNG, and WebP are allowed.`]
        };
      }

      if (photo.size > maxSize) {
        return {
          success: false,
          message: 'Photo too large',
          errors: [`Photo ${photo.name} is too large. Maximum size is 5MB.`]
        };
      }
    }

    // Upload photos to Cloudinary
    const photoUrls: string[] = [];
    
    for (let i = 0; i < Math.min(photos.length, 5); i++) {
      try {
        const photoUrl = await uploadPhotoToCloudinary(photos[i]);
        photoUrls.push(photoUrl);
      } catch (error) {
        // If photo upload fails, clean up already uploaded photos
        for (const uploadedUrl of photoUrls) {
          try {
            const publicId = uploadedUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`car-rentals/${publicId}`);
            }
          } catch (cleanupError) {
            console.error('Failed to cleanup photo:', cleanupError);
          }
        }
        
        return {
          success: false,
          message: `Failed to upload photos to Cloudinary ${error}`,
          errors: [`Failed to upload photo ${photos[i].name}: ${error}`]
        };
      }
    }

    // Create car record in database
    const car = await prisma.car.create({
      data: {
        name: carData.name.trim(),
        type: carData.type.trim(),
        transmission: carData.transmission.trim(),
        seats: carData.seats,
        fuelType: carData.fuelType.trim(),
        perDayCharge: carData.perDayCharge,
        description: carData.description?.trim() || null,
        mileage: carData.mileage || null,
        year: carData.year || null,
        color: carData.color?.trim() || null,
        features: carData.features || [],
        photo1: photoUrls[0],
        photo2: photoUrls[1] || null,
        photo3: photoUrls[2] || null,
        photo4: photoUrls[3] || null,
        photo5: photoUrls[4] || null,
        isAvailable: true,
        isActive: true,
      }
    });

    return {
      success: true,
      message: 'Car added successfully',
      carId: car.id
    };

  } catch (error) {
    console.error('Error adding car:', error);
    
    return {
      success: false,
      message: 'Failed to add car',
      errors: [`An unexpected error occurred: ${error}`]
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Function to delete car (with cleanup)
export async function deleteCar(carId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get car details to cleanup photos
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    // Delete photos from Cloudinary
    const photos = [car.photo1, car.photo2, car.photo3, car.photo4, car.photo5].filter(Boolean);
    
    for (const photoUrl of photos) {
      if (!photoUrl) continue;
      try {
        // Extract public ID from Cloudinary URL
        const parts = photoUrl.split('/');
        const fileNameWithExt = parts[parts.length - 1];
        const publicId = `car-rentals/${fileNameWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cleanupError) {
        console.error('Failed to cleanup photo:', cleanupError);
      }
    }

    // Delete car from database
    await prisma.car.delete({
      where: { id: carId }
    });

    return {
      success: true,
      message: 'Car deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting car:', error);
    
    return {
      success: false,
      message: 'Failed to delete car'
    };
  } finally {
    await prisma.$disconnect();
  }
}