"use client";
import React from "react";
import ArrowLeftIcon from "@/public/sidebar-icons/arrow-narrow-left.svg";
import CompanyIcon from "@/public/sidebar-icons/company.svg";
import LuggageIcon from "@/public/sidebar-icons/luggage-icon.svg";
import HeartIcon from "@/public/sidebar-icons/heart-icon.svg";
import CreditCardIcon from "@/public/sidebar-icons/credit-card.svg";
import SettingsIcon from "@/public/sidebar-icons/settings-icon.svg";
import PlaneIcon from "@/public/sidebar-icons/plane-icon.svg";
import UserIcon from "@/public/sidebar-icons/user-icon.svg";
import ProfileImage from "@/public/images/Avatar.png";
import LogoutIcon from "@/public/sidebar-icons/logout-icon.svg";
import MessageChatIcon from "@/public/sidebar-icons/message-chat-icon.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar = ({ onItemClick }: SidebarProps) => {
  const pathname = usePathname();
  const user = JSON.parse(localStorage.getItem('auth') || '{}')?.user;

  const primaryNavItems = [
    {
      href: "/profile",
      icon: UserIcon,
      label: "Account",
    },
    {
      href: "/profile/bookings",
      icon: LuggageIcon,
      label: "My Bookings",
    },
    {
      href: "/profile/favorites",
      icon: HeartIcon,
      label: "Favorites",
    },
    {
      href: "/profile/payments",
      icon: CreditCardIcon,
      label: "Payments",
    },
    {
      href: "/profile/preferences",
      icon: SettingsIcon,
      label: "Preferences",
    },
    {
      href: "/profile/itineraries",
      icon: PlaneIcon,
      label: "My Itineraries",
    },
  ];

  const secondaryNavItems = [
    {
      href: "/profile/terms",
      icon: CreditCardIcon,
      label: "Terms and Conditions",
    },
    {
      href: "/profile/help",
      icon: MessageChatIcon,
      label: "Help Center",
    }, 
    {
      href: "/profile/privacy",
      icon: MessageChatIcon,
      label: "Privacy Policy",
    },
    {
      href: "/profile/cancellation",
      icon: SettingsIcon,
      label: "Cancellation Policy",
    },
  ];

  return (
    <div className="h-screen max-md:w-full  w-[376px] min-w-[376px] pb-8  px-8 flex flex-col relative before:absolute before:right-0 before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-primary-gray before:to-transparent">
      {/* Profile Section */}
      <div className="flex flex-col gap-4 mb-12">
        <div onClick={onItemClick} className="flex items-center gap-4 md:hidden">
          <ArrowLeftIcon className="" />
          <div className="text-primary-gray text-sm">Back to Home</div>
        </div>
        <div className="flex items-center gap-4">
          <Image src={ProfileImage} alt="Profile" width={56} height={56} />
          <div className="text-white flex flex-col gap-1">
            <div className="font-bold text-xl">{user?.first_name || 'John'} {user?.last_name || 'James'}</div>
            <div className="flex items-center gap-2">
              <div className="p-[2px]">
                <CompanyIcon />
              </div>
              <div className="text-sm font-bold">
                220 Points
                <span className="text-sm font-normal">($22)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 text-white">
        {/* Navigation Items 1*/}
        <nav className="flex flex-col gap-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 flex items-center gap-3 hover:bg-[#141414] rounded-lg ${
                  isActive ? "bg-[#141414]" : ""
                }`}
                onClick={onItemClick}
              >
                <Icon />
                <div className="font-bold text-sm">{item.label}</div>
              </Link>
            );
          })}
        </nav>

        {/* Navigation Items 2*/}
        <nav className="flex flex-col gap-2">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 flex items-center gap-3 hover:bg-[#141414] rounded-lg ${
                  isActive ? "bg-[#141414]" : ""
                }`}
                onClick={onItemClick}
              >
                <Icon />
                <div className="font-bold text-sm">{item.label}</div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Items */}
        <nav className="flex flex-col gap-2">
          <div className="p-3 flex items-center gap-3 hover:bg-[#141414] rounded-lg cursor-pointer ">
            <LogoutIcon />
            <div className="font-bold text-sm">Sign Out</div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
