import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterWithRouteContact from "@/components/layout/FooterWithRouteContact";
import Navbar from "@/components/layout/navbar";
import FloatingActions from "@/components/ui/FloatingActions";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  applicationName: "HackMol 7.0",
  category: "Technology",
  metadataBase: new URL("https://hackmol.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HackMol 7.0 — Into the Hollow of Innovation",
    description: "NIT Jalandhar's flagship 30-hour hackathon. Descend into the depths of innovation. Build real-world solutions. Win exciting prizes. March 28-29, 2026.",
    url: "https://hackmol.com",
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
    creator: "@GDSCNitj",
    site: "@GDSCNitj",
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
    google: "dxUBhkPvidgnshXZ9hg7wPgh4sMPCgaORzOFmAmsLVY",
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
    "image": "https://hackmol.com/og-image.png",
    "organizer": {
      "@type": "Organization",
      "name": "Google Developer Groups on Campus - NIT Jalandhar",
      "url": "https://hackmol.com"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://hackmol-7.devfolio.co",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-02-24T00:00:00+05:30",
      "validThrough": "2026-03-24T23:59:59+05:30"
    },
    "sponsor": [
      {
        "@type": "Organization",
        "name": "Devfolio",
        "url": "https://devfolio.co",
        "logo": "https://hackmol.com/assets/sponsors/devfolio_white.png"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="dxUBhkPvidgnshXZ9hg7wPgh4sMPCgaORzOFmAmsLVY" />
        <meta name="theme-color" content="#080e1c" />
        <meta name="color-scheme" content="dark" />
        <meta name="sponsored-by" content="Devfolio" />
        <meta name="platform-partner" content="Devfolio" />
        <link rel="preload" href="/assets/sponsors/devfolio_white.png" as="image" />
        

        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
                <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global error handler to suppress third-party script console noise
              window.addEventListener('error', function(e) {
                // Known third-party domains that get blocked by ad blockers
                const blockedDomains = [
                  'static.cloudflareinsights.com',
                  'cdn.rudderlabs.com', 
                  'js.sentry-cdn.com',
                  'maps.googleapis.com',
                  'www.google.com/recaptcha'
                ];
                
                if (e.filename && blockedDomains.some(domain => e.filename.includes(domain))) {
                  // Prevent these errors from logging to console
                  e.preventDefault();
                  return false;
                }
              });
              
              // Handle unhandled promise rejections from blocked scripts
              window.addEventListener('unhandledrejection', function(e) {
                const message = e.reason?.message || e.reason?.toString() || '';
                if (message.includes('ERR_BLOCKED_BY_CLIENT') || 
                    message.includes('Failed to load script') ||
                    message.includes('NetworkError')) {
                  e.preventDefault();
                  return false;
                }
              });
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased flex flex-col min-h-screen`}
      >
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <FooterWithRouteContact />
        <FloatingActions />
        <Analytics />
        <GoogleAnalytics gaId="G-Z5ZGV0B6C4" />
      </body>
    </html>
  );
}
