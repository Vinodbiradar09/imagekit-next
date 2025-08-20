import type { Metadata,  Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthProvider from "./context/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Header from "@/components/Headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Reels Pro - Next Generation Video Sharing",
  description: "Create, upload, and discover amazing content with AI-powered tools.",
  keywords: ["video", "reels", "upload", "share", "AI", "content creation"],
  authors: [{ name: "Reels Pro Team" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}>
        <AuthProvider session={session}>
          <Providers session={session}>
            <Header />
            <main className="relative z-0">{children}</main>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
