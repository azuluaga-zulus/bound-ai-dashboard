import type { Metadata } from "next";
import "./globals.css";
import PerformanceOptimizer from "@/components/ui/PerformanceOptimizer";

export const metadata: Metadata = {
  title: "Bound - AI Agents That Drive Revenue",
  description: "Build intelligent AI agents that understand your business, engage prospects with personalized conversations, and convert visitors into paying clients.",
  keywords: ["AI agents", "lead generation", "sales automation", "customer engagement", "business intelligence"],
  authors: [{ name: "Bound AI" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Bound - AI Agents That Drive Revenue",
    description: "Stop wasting time on generic chatbots. Build intelligent AI agents that convert visitors into paying clients.",
    type: "website",
    url: "https://bound.work",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bound - AI Agents That Drive Revenue",
    description: "Build intelligent AI agents that convert visitors into paying clients.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#0A1B2E" />
      </head>
      <body className="antialiased">
        <PerformanceOptimizer />
        {children}
      </body>
    </html>
  );
}