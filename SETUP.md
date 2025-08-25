# Car Rental Admin System Setup

This guide will help you set up the car rental admin system with backend integration.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Cloudinary account for image storage

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rudracarrentals"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the admin panel:**
   - Navigate to `http://localhost:3000/admin`
   - Login with:
     - Email: `admin@rudracarrental.com`
     - Password: `admin123`

## Features

- **Car Management:** Add, edit, and delete cars
- **Image Upload:** Upload up to 5 images per car using Cloudinary
- **Real-time Updates:** Changes are immediately reflected in the database
- **Responsive Design:** Works on desktop and mobile devices

## Database Schema

The system uses a PostgreSQL database with the following main table:

- **cars:** Stores car information including photos, pricing, and availability

## Backend Integration

The admin panel is now fully connected to the backend with:

- **Server Actions:** Using Next.js 15 server actions for API calls
- **Image Storage:** Cloudinary integration for photo management
- **Data Validation:** Comprehensive validation on both frontend and backend
- **Error Handling:** Proper error messages and loading states

## Troubleshooting

1. **Database Connection Issues:**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL format
   - Run `npx prisma db push` to sync schema

2. **Image Upload Issues:**
   - Verify Cloudinary credentials
   - Check file size (max 5MB per image)
   - Ensure image format is JPEG, PNG, or WebP

3. **Build Issues:**
   - Run `npx prisma generate` after schema changes
   - Clear Next.js cache: `rm -rf .next`
