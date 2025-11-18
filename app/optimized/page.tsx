export default function Page() {

      const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "JetRide Rentals",
    "url": "https://www.jetriderentals.com",
    "logo": "https://www.jetriderentals.com/logo.png",
    "description": "JetRide Rentals provides affordable car, bike, and scooty rentals in Chandigarh, Mohali, and Panchkula.",
    "areaServed": ["Chandigarh", "Mohali", "Panchkula"],
    "telephone": "+91-9090151546",
    "priceRange": "₹₹",
    "openingHours": "Mo-Su 00:00-23:59",
    "sameAs": [
      "https://www.instagram.com/jetriderentals",
      "https://www.facebook.com/jetriderentals"
    ]
  };
  return (
    <div>
      <h1>Welcome to Jet Ride Rentals</h1>
      <p>
        Experience luxury and comfort with our wide selection of premium vehicles. From sedans to SUVs, find your perfect ride today.
      </p>

      <h2>Why Choose Us?</h2>
      <p>
        We provide exceptional service and premium vehicles to make your journey memorable. All our vehicles are regularly serviced and maintained to ensure your safety and comfort.
      </p>

      <h2>Contact Us</h2>
      <p>Call Us: <strong>+91 90901 51546</strong></p>
      <p>Email Us: <strong>jetriderentals@gmail.com</strong></p>
      <p>Visit Us: Cabin No. 4, SCO-210, Sector 14, Panchkula, Haryana, India</p>

      <h2>FAQs</h2>
      <p>What types of vehicles are available for rent? <strong>We offer sedans, SUVs, luxury cars, and hatchbacks.</strong></p>
      <p>Is there a booking fee? <strong>Yes, a Rs.5000 advance booking amount is required.</strong></p>
      <p>Do you offer airport transfer services? <strong>Yes, airport transfer services are available upon request.</strong></p>
    </div>
  );
}
