import React from "react";
import { Nunito, Manrope } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "@/src/components/navbar/Navbar";
import ClientOnly from "@/src/components/ClientOnly";
import ModalContainer from "../components/ModalContainer";
import DrawerModal from "../components/DrawerModal";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';

export const metadata = {
  title: "ACTOTA!",
  description: "Personalized Tours Made Easy",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/images/logo.png",
    },
  },
};

const font = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load runtime environment variables dynamically */}
        <Script 
          src="/runtime-config/env.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${font.className}`}>
        <Providers>
          <ClientOnly>
            <ModalContainer />
            <Navbar />
          </ClientOnly>
          <div>{children}</div>
        <Toaster />
        </Providers>
      </body>
    </html>
  );
}
