import React from "react";
import { Nunito } from 'next/font/google';
import "./globals.css";

import Navbar from "./components/navbar/Navbar";
import ClientOnly from './components/ClientOnly';


export const metadata = {
  title: "ACTOTA!",
  description: "Personalized Tours Made Easy",
};

const font = Nunito({
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={`neutral-01 ${font.className}`}>
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
