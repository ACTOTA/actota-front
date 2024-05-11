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
import Home from "../pages/home/page";

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
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
          <div>
            <main className="px-8 mx-auto max-w-7xl sm:px-16">
              <section className="pt-6">
                <h2 className="pb-5 text-4xl font-semibold">
                  Featured Listings
                </h2>
              </section>
            </main>
          </div>
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
        <Filter />
      </body>
    </html>
  );
}
