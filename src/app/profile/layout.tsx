import React from "react";
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


export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="flex max-w-[1280px] mx-auto pt-20">
          <Sidebar />
          <div className="flex-1 text-white p-8">{children}</div>
        </div>
  );
}
