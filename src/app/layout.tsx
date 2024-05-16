import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import { Toaster } from "react-hot-toast";
import LoginModal from "@/components/modals/LoginModal";
import RentModal from "@/components/modals/RentModal";
import SearchModal from "@/components/modals/SearchModal";
import { Suspense } from "react";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb | Vacation rentals, cabins, beach houses, & more",
  description: "Get an Airbnb for every kind of trip → 7 million vacation rentals → 2 million Guest Favorites → 220+ countries and regions worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>

        <Toaster />
        <LoginModal />
        <RegisterModal />

        <Suspense>
          <SearchModal />
        </Suspense>

        <RentModal />

        <Navbar />

        <main className="pb-20 pt-28">
          {children}
        </main>
      </body>
    </html>
  );
}
