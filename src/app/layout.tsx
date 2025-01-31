import React from "react";
import { Nunito ,Manrope} from 'next/font/google';
import "./globals.css";

import Navbar from "@/src/components/navbar/Navbar";
import ClientOnly from '@/src/components/ClientOnly';


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
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],

});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <ClientOnly>
          <Navbar />
        </ClientOnly>
        <div>
          {children}
        </div>

      </body>
    </html>
  );
}
