export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "Jet Ride Rentals",
    "url": "https://www.jetriderentals.com",
    "logo": "https://www.jetriderentals.com/logo.png",
    "description": "Jet Ride Rentals provides self-drive and chauffeur-driven cars, bikes, and scooties across Chandigarh, Mohali, and Panchkula (TriCity). Choose from a fleet of sedans, SUVs, hatchbacks, and luxury cars. 24/7 support, transparent pricing, and top-rated service.",
    "areaServed": ["Chandigarh", "Mohali", "Panchkula", "TriCity"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cabin No. 4, SCO-210, Sector 14",
      "addressLocality": "Panchkula",
      "addressRegion": "Haryana",
      "postalCode": "134113",
      "addressCountry": "IN"
    },
    "telephone": "+91-9090151546",
    "priceRange": "\u20B9\u20B9",
    "openingHours": "Mo-Su 00:00-23:59",
    "sameAs": [
      "https://www.instagram.com/jetriderentals",
      "https://www.facebook.com/jetriderentals"
    ],
    "serviceArea": [
      {
        "@type": "Place",
        "name": "Chandigarh"
      },
      {
        "@type": "Place",
        "name": "Mohali"
      },
      {
        "@type": "Place",
        "name": "Panchkula"
      },
      {
        "@type": "Place",
        "name": "TriCity"
      }
    ]
  };

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <h1>Welcome to Jet Ride Rentals – TriCity's Premier Car, Bike, and Scooty Rental Service</h1>
      <p>
        Serving <strong>Chandigarh, Mohali, and Panchkula</strong>, Jet Ride Rentals offers a diverse range of well-maintained self-drive and chauffeur-driven vehicles for your convenience. Our transparent pricing, reliable support, and premium fleet ensure a memorable rental experience.
      </p>
      <h2>Why Choose Jet Ride Rentals?</h2>
      <ul>
        <li>Extensive fleet: hatchbacks, sedans, SUVs, luxury cars, bikes, and scooties</li>
        <li>Service areas: Chandigarh, Mohali, Panchkula (TriCity) and nearby regions</li>
        <li>Online booking with instant confirmation</li>
        <li>24/7 customer support & emergency assistance</li>
        <li>Airport pickup/drop on request</li>
        <li>Competitive pricing; special offers for NRIs and families</li>
        <li>Fully sanitized and regularly serviced vehicles</li>
        <li>No hidden charges</li>
      </ul>
      <h2>Contact Us</h2>
      <p>Phone: <strong>+91 90901 51546</strong></p>
      <p>Email: <strong>jetriderentals@gmail.com</strong></p>
      <p>Address: Cabin No. 4, SCO-210, Sector 14, Panchkula, Haryana, India</p>

      <h2>Vehicles Available</h2>
      <ul>
        <li>Hatchbacks (Maruti Swift, Hyundai i10, etc.)</li>
        <li>Sedans (Honda City, Hyundai Verna, Maruti Ciaz, etc.)</li>
        <li>SUVs (Toyota Fortuner, Mahindra XUV700, etc.)</li>
        <li>Luxury Cars (Audi A4, Mercedes C-Class, BMW 3 series, etc.)</li>
        <li>Bikes & Scooties (Activa, Bullet, Duke, etc.)</li>
      </ul>

      <h2>Frequently Asked Questions (FAQs)</h2>
      <ul>
        <li><strong>What is the minimum age for self-drive rental?</strong> Drivers must be at least 21 years old and possess a valid driving license.</li>
        <li><strong>Which areas do you serve?</strong> We provide rentals in Chandigarh, Mohali, Panchkula, and the TriCity region.</li>
        <li><strong>Is advance booking required?</strong> Yes, a refundable advance of Rs. 5000 is required to confirm your booking.</li>
        <li><strong>What documents do I need?</strong> Original driving license, Aadhaar/passport, and, for NRIs, international driving permit.</li>
        <li><strong>Do you offer airport transfers?</strong> Yes, airport pickup and drop services are available on prior request.</li>
        <li><strong>Are the vehicles insured?</strong> Yes, all vehicles are comprehensively insured.</li>
        <li><strong>How do I pay?</strong> Online payments, UPI, and cash accepted.</li>
        <li><strong>Can I extend my booking?</strong> Yes. Extensions are subject to vehicle availability. Please contact support.</li>
        <li><strong>What is your cancellation policy?</strong> Cancellations up to 24 hours before pickup are eligible for refund minus nominal admin charges.</li>
        <li><strong>Do you service late-night/early-morning bookings?</strong> Yes, we operate 24/7 for rentals and support.</li>
        <li><strong>Are one-way rentals possible?</strong> Yes, city-to-city one-way rentals can be arranged (extra charges may apply).</li>
      </ul>

      <h2>Customer Testimonials</h2>
      <ul>
        <li>“Very smooth process. Car was clean, pick-up was quick. Will recommend for anyone in Chandigarh.” – Amanpreet S., Chandigarh</li>
        <li>“Booked from UK for my family. Great NRI services and transparency.” – Ravi P., Mohali</li>
        <li>“Needed a last-minute bike in Sector 17. Jet Ride Rentals delivered in under 30 minutes!” – Priya T., Panchkula</li>
      </ul>

      <h2>About Us</h2>
      <p>
        Jet Ride Rentals is a locally owned, top-rated provider serving the entire TriCity area since 2022.
        With 5.0 stars on Google, 60+ reviews, and recognition for customer satisfaction, we are committed to reliability, safety, and customer delight. Book with us and drive with confidence.
      </p>
    </div>
  );
}
