/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from '../../generated/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure Cloudinary
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
  isAvailable?: boolean;
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
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Get all cars with optimized query
export async function getAllCars(): Promise<{ success: boolean; cars?: any[]; message?: string }> {
  try {
    // Optimized query with only needed fields and proper indexing
    const cars = await prisma.car.findMany({
      where: { 
        isActive: true,
        isAvailable: true // Only show available cars by default
      },
      select: {
        id: true,
        name: true,
        type: true,
        perDayCharge: true,
        mileage: true,
        seats: true,
        transmission: true,
        year: true,
        fuelType: true,
        description: true,
        isAvailable: true,
        photo1: true,
        photo2: true,
        photo3: true,
        photo4: true,
        photo5: true,
        features: true,
        color: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 cars for better performance
    });

    // Transform the data to match the frontend format
    const transformedCars = cars.map((car) => ({
      id: car.id,
      name: car.name,
      type: car.type,
      price: car.perDayCharge,
      mileage: car.mileage ? `${car.mileage} kmpl` : "N/A",
      seater: `${car.seats} Seater`,
      transmission: car.transmission,
      rating: 4.5, // Default rating for now
      year: car.year?.toString() || "N/A",
      fuelType: car.fuelType,
      engineCapacity: "N/A", // Not in schema, can be added later
      description: car.description || "",
      status: car.isAvailable ? "Available" : "Rented",
      images: [car.photo1, car.photo2, car.photo3, car.photo4, car.photo5].filter(Boolean),
      features: car.features || [],
      color: car.color,
      priceBreakdown: {
        basePrice: car.perDayCharge,
        insurance: Math.round(car.perDayCharge * 0.08),
        taxes: Math.round(car.perDayCharge * 0.12),
        total: car.perDayCharge + Math.round(car.perDayCharge * 0.08) + Math.round(car.perDayCharge * 0.12),
      },
    }));

    return {
      success: true,
      cars: transformedCars
    };

  } catch (error) {
    console.error('Error fetching cars:', error);
    
    return {
      success: false,
      message: 'Failed to fetch cars'
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get single car by ID with optimized query
export async function getCarById(carId: string): Promise<{ success: boolean; car?: any; message?: string }> {
  try {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        id: true,
        name: true,
        type: true,
        perDayCharge: true,
        mileage: true,
        seats: true,
        transmission: true,
        year: true,
        fuelType: true,
        description: true,
        isAvailable: true,
        photo1: true,
        photo2: true,
        photo3: true,
        photo4: true,
        photo5: true,
        features: true,
        color: true,
      }
    });

    if (!car) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    // Transform the data to match the frontend format
    const transformedCar = {
      id: car.id,
      name: car.name,
      type: car.type,
      price: car.perDayCharge,
      mileage: car.mileage ? `${car.mileage} kmpl` : "N/A",
      seater: `${car.seats} Seater`,
      transmission: car.transmission,
      rating: 4.5, // Default rating for now
      year: car.year?.toString() || "N/A",
      fuelType: car.fuelType,
      engineCapacity: "N/A", // Not in schema, can be added later
      description: car.description || "",
      status: car.isAvailable ? "Available" : "Rented",
      images: [car.photo1, car.photo2, car.photo3, car.photo4, car.photo5].filter(Boolean),
      features: car.features || [],
      color: car.color,
      priceBreakdown: {
        basePrice: car.perDayCharge,
        insurance: Math.round(car.perDayCharge * 0.08),
        taxes: Math.round(car.perDayCharge * 0.12),
        total: car.perDayCharge + Math.round(car.perDayCharge * 0.08) + Math.round(car.perDayCharge * 0.12),
      },
    };

    return {
      success: true,
      car: transformedCar
    };

  } catch (error) {
    console.error('Error fetching car:', error);
    
    return {
      success: false,
      message: 'Failed to fetch car'
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update car
export async function updateCar(
  carId: string,
  carData: CarData,
  newPhotos?: PhotoFile[]
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  try {
    // Validate car data
    const validation = validateCarData(carData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    // Get existing car
    const existingCar = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!existingCar) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    // Handle new photos if provided
    const photoUrls: string[] = [];
    if (newPhotos && newPhotos.length > 0) {
      if (newPhotos.length > 5) {
        return {
          success: false,
          message: 'Too many photos',
          errors: ['Maximum 5 photos allowed']
        };
      }

      // Validate photo files
      const validPhotoTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (const photo of newPhotos) {
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

      // Upload new photos to Cloudinary
      for (let i = 0; i < newPhotos.length; i++) {
        try {
          const photoUrl = await uploadPhotoToCloudinary(newPhotos[i]);
          photoUrls.push(photoUrl);
        } catch (error) {
          // Cleanup already uploaded photos
          for (const uploadedUrl of photoUrls) {
            try {
              const publicId = uploadedUrl.split('/').pop()?.split('.')[0];
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
              }
            } catch (cleanupError) {
              console.error('Failed to cleanup photo:', cleanupError);
            }
          }
          
          return {
            success: false,
            message: 'Failed to upload photos',
            errors: [`Failed to upload photo ${newPhotos[i].name}: ${error}`]
          };
        }
      }
    }

    // Update car in database
    const updateData: any = {
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
      isAvailable: carData.isAvailable ?? existingCar.isAvailable,
    };

    // Update photos if new ones were uploaded
    if (photoUrls.length > 0) {
      updateData.photo1 = photoUrls[0];
      updateData.photo2 = photoUrls[1] || null;
      updateData.photo3 = photoUrls[2] || null;
      updateData.photo4 = photoUrls[3] || null;
      updateData.photo5 = photoUrls[4] || null;
    }

    await prisma.car.update({
      where: { id: carId },
      data: updateData
    });

    return {
      success: true,
      message: 'Car updated successfully'
    };

  } catch (error) {
    console.error('Error updating car:', error);
    
    return {
      success: false,
      message: 'Failed to update car',
      errors: ['An unexpected error occurred. Please try again.']
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete car
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
    const photos: string[] = [car.photo1, car.photo2, car.photo3, car.photo4, car.photo5].filter((p): p is string => Boolean(p));
    
    for (const photoUrl of photos) {
      try {
        const publicId = photoUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
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
