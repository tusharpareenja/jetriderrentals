import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "Jet Rider Rentals - Best Car Rent Services in Chandigarh | Premium Car Rentals",
  description:
    "Rent premium cars in Chandigarh with Jet Rider Rentals. Best car rental service offering sedans, hatchbacks, SUVs & luxury vehicles at competitive prices. Book now for hassle-free car hire in Chandigarh.",
  keywords: [
    "car rent chandigarh",
    "chandigarh car rent",
    "car rental chandigarh",
    "chandigarh car rental",
    "rent a car chandigarh",
    "car hire chandigarh",
    "self drive cars chandigarh",
    "luxury car rental chandigarh",
    "sedan rental chandigarh",
    "hatchback rental chandigarh",
    "SUV rental chandigarh",
    "jet rider rentals",
    "best car rental chandigarh",
    "cheap car rental chandigarh",
    "car booking chandigarh",
    "chandigarh taxi service",
    "premium car rental chandigarh",
  ],
  openGraph: {
    title: "Jet Rider Rentals - Best Car Rent Services in Chandigarh",
    description:
      "Rent premium cars in Chandigarh with Jet Rider Rentals. Wide selection of vehicles at competitive prices with 24/7 support.",
    url: "https://jetriderrentals.com",
    siteName: "Jet Rider Rentals",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "Jet Rider Rentals - Premium Car Rentals in Chandigarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jet Rider Rentals - Best Car Rent Services in Chandigarh",
    description:
      "Rent premium cars in Chandigarh with Jet Rider Rentals. Wide selection of vehicles at competitive prices.",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
  alternates: {
    canonical: "https://jetriderrentals.com",
  },
}

export default function Page() {
  return <ClientPage />
}
