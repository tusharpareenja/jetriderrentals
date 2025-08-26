import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Jet Ride Rentals - Premium Car Rentals in Chandigarh | Best Car Rent Services",
  description:
    "Rent premium cars in Chandigarh with Jet Ride Rentals. Wide selection of sedans, hatchbacks, SUVs, and luxury vehicles at competitive prices. Best car rental service in Chandigarh with 24/7 support.",
  keywords: [
    "car rent chandigarh",
    "chandigarh car rent",
    "car rental chandigarh",
    "car rental in chandigarh",
    "trycity car rental",
    "trycity car rental chandigarh",
    "kharar car rental",
    "kharar car rent",
    "kharar car rental in chandigarh",
    "kharar car rental in chandigarh",
    "kharar car rental in chandigarh",
    "Zirakpur car rental",
    "Zirakpur car rent",
    "Zirakpur car rental in chandigarh",
    "Zirakpur car rental in chandigarh",
    "Mohali car rental",
    "Mohali car rent",
    "Mohali car rental in chandigarh",
    "Mohali car rental in chandigarh",
    "Panchkula car rental",
    "Panchkula car rent",
    "Panchkula car rental in chandigarh",
    "Panchkula car rental in chandigarh",
    "chandigarh car rental",
    "rent a car chandigarh",
    "car hire chandigarh",
    "self drive cars chandigarh",
    "luxury car rental chandigarh",
    "sedan rental chandigarh",
    "hatchback rental chandigarh",
    "SUV rental chandigarh",
    "jet ride rentals",
    "best car rental chandigarh",
    "cheap car rental chandigarh",
    "car booking chandigarh",
    "jet ride car rentals",
    "car rental services chandigarh",
    "rentals in chandigarh",
    "car rental deals chandigarh",
    "affordable car rental chandigarh",
    "car rental offers chandigarh",
    "car rental discounts chandigarh",
    "car rental packages chandigarh",
  ],
  authors: [{ name: "Jet Ride Rentals" }],
  creator: "Jet Ride Rentals",
  publisher: "Jet Ride Rentals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jetriderrentals.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jet Ride Rentals - Premium Car Rentals in Chandigarh",
    description:
      "Rent premium cars in Chandigarh with Jet Ride Rentals. Wide selection of vehicles at competitive prices with 24/7 support.",
    url: "https://jetriderrentals.com",
    siteName: "Jet Ride Rentals",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "Jet Ride Rentals - Premium Car Rentals in Chandigarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jet Ride Rentals - Premium Car Rentals in Chandigarh",
    description:
      "Rent premium cars in Chandigarh with Jet Ride Rentals. Wide selection of vehicles at competitive prices.",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
