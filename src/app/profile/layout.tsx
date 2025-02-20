import React from "react";
import Sidebar from "@/src/components/profileComponents/sidebar/Sidebar";



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
