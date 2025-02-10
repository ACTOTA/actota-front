import React from "react";
import { Manrope } from "next/font/google";
import "../globals.css";
import Sidebar from "@/src/components/profileComponents/sidebar/Sidebar";

// export const metadata = {
//   title: "ACTOTA!",
//   description: "Personalized Tours Made Easy",
//   icons: {
//     icon: "/images/logo.png",
//     shortcut: "/images/logo.png",
//     apple: "/images/logo.png",
//     other: {
//       rel: "apple-touch-icon-precomposed",
//       url: "/images/logo.png",
//     },

//   },
// };

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
      <body className={`${font.className}`}>
        <div className="flex max-w-[1280px] mx-auto">
          <Sidebar />
          <div className="flex-1 text-white p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
