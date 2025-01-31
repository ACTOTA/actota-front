"use client";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen relative flex  justify-center items-center">
      <Image
        width={10}
        height={10}
        src="/hero-bg.svg"
        alt="auth background"
        className="absolute inset-0 w-full h-screen object-cover"
        priority
      />
      <div className=" w-full flex-1 flex items-center justify-center">
        {children}
      </div>
    </main>
  );
}
