import { Nunito } from 'next/font/google';

import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from './components/ClientOnly';
// import Modal from './components/modals/Modal';
import RegisterModal from './components/modals/RegisterModal';

export const metadata = {
  title: "ACTOTA!",
  description: "Personalized Tours Made Easy",
};

const font = ({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <RegisterModal />
          {/* <Modal actionLabel="Submit" title="Hello World" isOpen/> */}
          <Navbar />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
