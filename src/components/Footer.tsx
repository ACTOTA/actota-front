'use client'

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { PiInstagramLogoFill } from "react-icons/pi";

export default function Footer() {
  const navigation = [
    {
      title: "Explore",
      links: ["Explore", "Activities", "Destinations", "Travelers", "Travelers"]
    },
    {
      title: "Product & Service",
      links: ["Products", "Products", "Products", "Products", "Products"]
    },
    {
      title: "Product & Service",
      links: ["Products", "Products", "Products", "Products", "Products"]
    },
    {
      title: "Product & Service",
      links: ["Products", "Products", "Products", "Products", "Products"]
    },
  ];

  return (
    <footer className=" text-white px-4 sm:px-6 lg:px-16 2xl:px-20 py-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Top section with logo and social links */}


        {/* Navigation columns */}
        <div className="flex justify-between max-sm:flex-col gap-8 mb-12">
          <div className="flex flex-col justify-start ">
            <div className="w-[120px] mb-6 sm:mb-12 relative">
              <Image
                src="/images/actota-logo.png"
                alt="ACTOTA"
                width={120}
                height={40}
                objectFit="contain"
              />
            </div>
            <div className="flex gap-4">
              <Link href="#" className="hover:opacity-80">
                <FaFacebook size={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <PiInstagramLogoFill size={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <FaTwitter size={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <FaLinkedin size={24} />
              </Link>
            </div>
          </div>
          <div className='w-full flex justify-between max-sm:flex-wrap gap-8'>

            {navigation.map((column, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-6">{column.title}</h3>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link === "Explore" ? "/location" : "#"} className="text-gray-400 hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center sm:pt-6 max-sm:flex-col max-sm:items-start max-sm:gap-4">
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white">
              English
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="#" className="text-gray-400 hover:text-white">
              Privacy
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="#" className="text-gray-400 hover:text-white">
              Legal
            </Link>
          </div>
          <div className="text-gray-400">
            © 2024 ACTOTA. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

