import type { Metadata } from "next";
import Script from 'next/script';
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering since we check auth in the layout
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: 'Medical Career Center | Healthcare Career Guide',
    template: '%s | Medical Career Center',
  },
  description: 'Your comprehensive guide to medical careers — salary data, job listings, top schools, licensure requirements, and career resources for 100+ healthcare professions.',
  metadataBase: new URL('https://medicalcareercenter.org'),
  openGraph: {
    type: 'website',
    siteName: 'Medical Career Center',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    const session = await auth();
    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          role: true,
        },
      });
    }
  } catch (e) {
    console.error("RootLayout Auth Error:", e);
    // Continue rendering as logged out
  }

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SFED06831C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'granted'
            });
            gtag('config', 'G-SFED06831C');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} font-sans flex flex-col min-h-screen bg-background text-foreground antialiased`}>
        <Header user={user} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
