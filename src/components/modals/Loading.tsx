// components/modals/ModalTwo.js
import Image from "next/image";
import React from "react";

export function Loading({ text,subText }: { text: string,subText?:any }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-20 rounded-lg shadow-lg " >

      <div className="relative w-12 h-12">
        <Image src="/svg-icons/Loader.png" alt="loader" className="animate-spin" fill />
      </div>

      <p className="mt-4 text-white text-lg">{text}</p>
      <p className="mt-4 text-primary-gray text-xs  text-center">{subText}</p>
    </div>

  );
}
