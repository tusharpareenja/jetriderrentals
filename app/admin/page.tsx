import type { Metadata } from "next"
import AdminClient from "./AdminClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - Jet Rider Rentals",
  description: "Admin panel for managing car rentals and bookings",
  robots: "noindex, nofollow",
}

export default function AdminPage() {
  return <AdminClient />
}
