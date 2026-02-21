import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import SmoothScroll from "@/components/SmoothScroll";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "HackMol 7.0 - Into the Hollow of Innovation | NIT Jalandhar",
  description: "HackMol 7.0 is the flagship annual hackathon of NIT Jalandhar. A 30-hour onsite innovation marathon where ideas descend into reality. Join 500+ developers nationwide. Descend. Discover. Develop.",
  keywords: [
    "HackMol 7.0",
    "hackathon",
    "NIT Jalandhar",
    "NITJ hackathon",
    "student hackathon India",
    "30-hour hackathon",
    "onsite hackathon",
    "coding competition",
    "tech innovation",
    "Hollow Knight theme",
    "AI hackathon",
    "blockchain hackathon",
    "IoT hackathon",
    "green technology",
    "IOTA NIT Jalandhar",
    "GDGC NITJ",
    "Devfolio hackathon",
  ],
  authors: [{ name: "Google Developer Groups on Campus - NIT Jalandhar" }],
  creator: "GDGC NIT Jalandhar & IOTA Media Cell",
  publisher: "NIT Jalandhar",
  metadataBase: new URL("https://hackmol.tech"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HackMol 7.0 — Into the Hollow of Innovation",
    description: "NIT Jalandhar's flagship 30-hour hackathon. Descend into the depths of innovation. Build real-world solutions. Win exciting prizes. March 28-29, 2026.",
    url: "https://hackmol.tech",
    siteName: "HackMol 7.0",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HackMol 7.0 - Into the Hollow of Innovation",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackMol 7.0 - Into the Hollow of Innovation | NIT Jalandhar",
    description: "Join NIT Jalandhar's flagship 30-hour hackathon. Descend. Discover. Develop. March 28-29, 2026.",
    images: ["/og-image.png"],
    creator: "@gdgc_nitj",
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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "HackMol 7.0 - Into the Hollow of Innovation",
    "description": "NIT Jalandhar's flagship annual hackathon. A 30-hour onsite innovation marathon where ideas descend into reality.",
    "startDate": "2026-03-28T08:00:00+05:30",
    "endDate": "2026-03-29T14:00:00+05:30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Dr. B R Ambedkar National Institute of Technology Jalandhar",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "G.T Road, Byepass",
        "addressLocality": "Jalandhar",
        "addressRegion": "Punjab",
        "postalCode": "144008",
        "addressCountry": "IN"
      }
    },
    "image": "https://hackmol.tech/og-image.png",
    "organizer": {
      "@type": "Organization",
      "name": "Google Developer Groups on Campus - NIT Jalandhar",
      "url": "https://hackmol.tech"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://hackmol-7.devfolio.co",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-02-21T00:00:00+05:30",
      "validThrough": "2026-02-24T23:59:59+05:30"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased flex flex-col min-h-screen`}
      >
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
