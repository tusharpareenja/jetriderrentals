import type { Metadata } from "next"
import NRIClient from "./NRI-Client"

export const metadata: Metadata = {
  title: "NRI Car Rental Services in Chandigarh | Monthly & Weekly Rentals | Jet Ride Rentals",
  description:
    "Exclusive car rental services for NRIs in Chandigarh. Monthly and weekly rental packages with well-maintained fleet. Easy booking, competitive rates, and hassle-free documentation.",
  keywords:
    "NRI car rental chandigarh, monthly car rental NRI, weekly car rental NRI, chandigarh car rent for NRI, NRI vehicle rental india, long term car rental chandigarh",
  openGraph: {
    title: "NRI Car Rental Services in Chandigarh | Jet Ride Rentals",
    description:
      "Exclusive car rental services for NRIs in Chandigarh with monthly and weekly packages. Well-maintained fleet with competitive rates.",
    url: "/nri",
    siteName: "Jet Ride Rentals",
    images: [
      {
        url: "/og-nri-image.jpg",
        width: 1200,
        height: 630,
        alt: "NRI Car Rental Services in Chandigarh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NRI Car Rental Services in Chandigarh | Jet Ride Rentals",
    description: "Exclusive car rental services for NRIs in Chandigarh with monthly and weekly packages.",
    images: ["/og-nri-image.jpg"],
  },
  alternates: {
    canonical: "/nri",
  },
}

export default function NRIPage() {
  return <NRIClient />
}
