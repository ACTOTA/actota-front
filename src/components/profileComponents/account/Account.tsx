"use client";
import React, { useState } from "react";
import Button from "../../figma/Button";
import Personal from "./PersonalInformation/Personal";
import VerificationPasswor from "./VerificationPassword/VerificationPasswor";
import EmailNotification from "./EmailNotification/EmailNotification";

const Account = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    {
      id: "personal",
      label: "Personal information",
      component: <Personal />
    },
    {
      id: "verification", 
      label: "Verification & Change Password",
      component: <VerificationPasswor />
    },
    {
      id: "email",
      label: "Email Notification", 
      component: <EmailNotification />
    }
  ];

  const renderContent = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab?.component || null;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
      <div className="flex flex-col gap-4">
        <div className="font-bold text-2xl">Account</div>
        <div className="flex gap-2">
          {tabs.map(tab => (
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
      </div>
      {/* body section */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default Account;
