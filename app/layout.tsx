import React from "react";
import { Nunito } from 'next/font/google';
import "./globals.css";

import Navbar from "./components/navbar/Navbar";
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import LoginModal from "./components/modals/LoginModal";
import RentModal from "./components/modals/RentModal";
import Filter from "./components/Filter"; // Make sure this path is correct
import SearchModal from "./components/modals/SearchModal";

import ToasterProvider from './providers/ToasterProvider';
import getCurrentUser from "./actions/getCurrentUser";
import Home from "./page";

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
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pt-20 pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}
