import type { Metadata } from "next"
import CarDetailClient from "./CarDetailClient"
import { getCarById } from "@/app/actions/carManagement"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  try {
    const result = await getCarById(id)
    
    if (!result.success || !result.car) {
      return {
        title: "Car Not Found - Jet Ride Rentals Chandigarh",
        description: "The requested car is not available. Browse our wide selection of rental cars in Chandigarh.",
      }
    }

    const car = result.car

      return {
      title: `${car.name} Rental in Chandigarh - ₹${car.price}/day | Jet Ride Rentals`,
      description: `Rent ${car.name} ${car.type} in Chandigarh at ₹${car.price} per day. ${car.description} Book now with Jet Ride Rentals for best car rental service in Chandigarh.`,
      keywords: [
        `${car.name.toLowerCase()} rental chandigarh`,
        `${car.name.toLowerCase()} rent chandigarh`,
        `${car.type.toLowerCase()} rental chandigarh`,
        `chandigarh ${car.type.toLowerCase()} rent`,
        `${car.name.toLowerCase()} car hire chandigarh`,
        `rent ${car.name.toLowerCase()} chandigarh`,
        `${car.name.toLowerCase()} booking chandigarh`,
        `chandigarh car rental ${car.name.toLowerCase()}`,
        `${car.transmission.toLowerCase()} car rental chandigarh`,
        `${car.fuelType.toLowerCase()} car rent chandigarh`,
                  "jet ride rentals",
        "car rent chandigarh",
        "chandigarh car rent",
        "best car rental chandigarh",
      ],
      openGraph: {
        title: `${car.name} Rental in Chandigarh - ₹${car.price}/day`,
        description: `Rent ${car.name} ${car.type} in Chandigarh. ${car.mileage} mileage, ${car.seater} capacity, ${car.transmission} transmission. Book now!`,
        url: `https://jetriderrentals.com/car/${car.id}`,
        siteName: "Jet Ride Rentals",
        images: [
          {
            url: car.images[0] || "/placeholder.svg?height=630&width=1200",
            width: 1200,
            height: 630,
            alt: `${car.name} - ${car.type} rental in Chandigarh`,
          },
        ],
        locale: "en_IN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${car.name} Rental in Chandigarh - ₹${car.price}/day`,
        description: `Rent ${car.name} ${car.type} in Chandigarh. ${car.mileage} mileage, ${car.seater} capacity. Book now with Jet Ride Rentals!`,
        images: [car.images[0] || "/placeholder.svg?height=630&width=1200"],
      },
      alternates: {
        canonical: `https://jetriderrentals.com/car/${car.id}`,
      },
      other: {
        "car:brand": car.name.split(" ")[0],
        "car:model": car.name,
        "car:type": car.type,
        "car:year": car.year,
        "car:transmission": car.transmission,
        "car:fuel_type": car.fuelType,
        "car:mileage": car.mileage,
        "car:seating_capacity": car.seater,
        "car:price_per_day": car.price.toString(),
        "car:rating": car.rating.toString(),
        "business:location": "Chandigarh, India",
        "business:phone": "+91 98765 43210",
                  "business:email": "jetriderentals@gmail.com",
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Car Not Found - Rudra Car Rental Chandigarh",
      description: "The requested car is not available. Browse our wide selection of rental cars in Chandigarh.",
    }
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CarDetailClient params={resolvedParams} />
}
