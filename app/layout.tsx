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
  title: "نظام تتبع الأداء - صالة الألعاب الرياضية",
  description: "نظام متكامل لتتبع الأداء والتطور في صالة الألعاب الرياضية",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#ea580c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "متتبع الأداء الرياضي",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "متتبع الأداء الرياضي",
    title: "نظام تتبع الأداء - صالة الألعاب الرياضية",
    description: "نظام متكامل لتتبع الأداء والتطور في صالة الألعاب الرياضية",
  },
  twitter: {
    card: "summary",
    title: "نظام تتبع الأداء - صالة الألعاب الرياضية",
    description: "نظام متكامل لتتبع الأداء والتطور في صالة الألعاب الرياضية",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <head>
        <meta name="application-name" content="متتبع الأداء الرياضي" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="متتبع الأداء الرياضي" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ea580c" />

        <link rel="apple-touch-icon" href="/gym-dumbbell-icon-orange.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/gym-dumbbell-icon-orange.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/gym-dumbbell-icon-orange.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/gym-dumbbell-icon-orange.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/gym-dumbbell-icon-orange.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/gym-dumbbell-icon-orange.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/gym-dumbbell-icon-orange.png" color="#ea580c" />
        <link rel="shortcut icon" href="/gym-dumbbell-icon-orange.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="متتبع الأداء الرياضي" />
        <meta name="twitter:description" content="نظام متكامل لتتبع الأداء والتطور في صالة الألعاب الرياضية" />
        <meta name="twitter:image" content="https://yourdomain.com/gym-dumbbell-icon-orange.png" />
        <meta name="twitter:creator" content="@yourusername" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="متتبع الأداء الرياضي" />
        <meta property="og:description" content="نظام متكامل لتتبع الأداء والتطور في صالة الألعاب الرياضية" />
        <meta property="og:site_name" content="متتبع الأداء الرياضي" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/gym-dumbbell-icon-orange.png" />
      </head>
      <body className="font-sans bg-background text-foreground">{children}</body>
    </html>
  )
}
