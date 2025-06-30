import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Globe } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lago Billing Examples",
  description: "Coding examples per-token, per-seat, per-transaction, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />

        <div className="container mx-auto px-4 mt-24">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center border-t py-8 mt-16">
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <a
              href="https://getlago.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Lago
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
