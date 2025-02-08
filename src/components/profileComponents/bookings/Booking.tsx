"use client";
import React, { useState } from "react";
import Button from "../../figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const tabs = [
    {
      id: "all",
      label: "All",
      component: <>121</>,
    },
    {
      id: "ongoing",
      label: "Ongoing",
      component: <>Ongoing</>,
    },
    {
      id: "upcoming",
      label: "Upcoming",
      component: <>Upcoming</>,
    },
    {
      id: "completed",
      label: "Completed",
      component: <>Completed</>,
    },
  ];

  const renderContent = () => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    return tab?.component || null;
  };
  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
      <div className="flex flex-col gap-4">
        <div className="font-bold text-2xl">Bookings</div>
        <div className="flex justify-between items-end">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="outline"
                size="sm"
                className={
                  activeTab === tab.id
                    ? "!border-white !text-white"
                    : "!border-border-primary !text-border-primary"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <Link
            href="/profile/bookings"
            className="text-base border-b-2 border-[#BBD4FB] text-[#BBD4FB]"
          >
            Can’t find your booking?
          </Link>
        </div>
      </div>
      {/* body section */}
      <div>
        <div className="mb-4">
          <Input
            placeholder="Select Your Bookings"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            icon={<FiSearch className="w-5 h-5" />}
            className="px-3 py-2.5 "
          />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Booking;
