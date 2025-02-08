"use client";
import React, { useState } from "react";
import Button from "../../figma/Button";
import Personal from "./PersonalInformation/Personal";
import VerificationPasswor from "./VerificationPassword/VerificationPasswor";

const Account = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <Personal />;
      case "verification":
        return <VerificationPasswor />;
      case "email":
        return (
          <div>
            <h3 className="text-xl mb-4">Email Notifications</h3>
            {/* Add email notification settings here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
      <div className="flex flex-col gap-4">
        <div className="font-bold text-2xl">Account</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={
              activeTab === "personal"
                ? "!border-white !text-white"
                : "!border-border-primary !text-border-primary"
            }
            onClick={() => setActiveTab("personal")}
          >
            Personal information
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={
              activeTab === "verification"
                ? "!border-white !text-white"
                : "!border-border-primary !text-border-primary"
            }
            onClick={() => setActiveTab("verification")}
          >
            Verification & Change Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={
              activeTab === "email"
                ? "!border-white !text-white"
                : "!border-border-primary !text-border-primary"
            }
            onClick={() => setActiveTab("email")}
          >
            Email Notification
          </Button>
        </div>
      </div>
      {/* body section */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default Account;
