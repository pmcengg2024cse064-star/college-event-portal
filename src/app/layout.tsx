import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "College Event Portal - EPMCE",
  description: "Discover and register for college events and departmental activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-950 via-violet-900 to-slate-950 min-h-screen text-white`}>
        <Header />
        <main className="relative z-1">
          {children}
        </main>
        {/* Decorative gradient orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-40"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-40"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-orange-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-30"></div>
        </div>
      </body>
    </html>
  );
}
