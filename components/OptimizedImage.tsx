"use client"

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallback?: string
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
  fallback = "/placeholder.svg",
  quality = 75
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Optimize Cloudinary URLs for better performance
  const getOptimizedUrl = (url: string) => {
    if (!url || url === fallback) return fallback
    
    // If it's a Cloudinary URL, add optimization parameters
    if (url.includes('cloudinary.com')) {
      const baseUrl = url.split('/upload/')[0] + '/upload/'
      const imagePath = url.split('/upload/')[1]
      
      // Add optimization parameters
      const optimizations = [
        'f_auto', // Auto format (WebP for supported browsers)
        'q_auto', // Auto quality
        'w_' + width,
        'h_' + height,
        'c_fill', // Crop mode
        'g_auto' // Auto gravity
      ].join(',')
      
      return `${baseUrl}${optimizations}/${imagePath}`
    }
    
    return url
  }

  const optimizedSrc = getOptimizedUrl(src)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={imageError ? fallback : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  )
}
