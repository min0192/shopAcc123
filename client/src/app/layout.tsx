import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop Tuấn Minh",
  description: "Shop Account Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-[#f8fafc] px-2 sm:px-0"}>
        <Header />
        <div className="max-w-5xl mx-auto w-full">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
