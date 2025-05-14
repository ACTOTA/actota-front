"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../figma/Button";
import Personal from "./PersonalInformation/Personal";
import VerificationPasswor from "./VerificationPassword/VerificationPasswor";
import EmailNotification from "./EmailNotification/EmailNotification";
import { useAccountInfo } from "@/src/hooks/queries/account/useAccountQuery";
const Account = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userId, setUserId] = useState<string>("");
  
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.user_id) {
        setUserId(user.user_id);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);
  
  const { data: accountInfo, isLoading } = useAccountInfo(userId);
  
  const tabs = useMemo(() => [
    {
      id: "personal",
      label: "Personal information",
      component: <Personal key={`personal-${activeTab}`} data={accountInfo} />
    },
    {
      id: "verification",
      label: "Verification & Change Password",
      component: <VerificationPasswor key={`verification-${activeTab}`} data={accountInfo} />
    },
    {
      id: "email",
      label: "Email Notification",
      component: <EmailNotification key={`email-${activeTab}`} data={accountInfo} />
    }
  ], [accountInfo, activeTab]);

  const renderContent = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab?.component || null;
  };

  return (
    <div className="">
      {/* header section */}
        <div className="font-bold text-2xl">Account</div>
        <div className=' overflow-auto scrollbar-hide my-4'>
          <div className="flex items-center gap-2">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant="outline"
                size="sm"
                className={
                  activeTab === tab.id
                    ? "!border-white !text-white whitespace-nowrap"
                    : "!border-border-primary !text-border-primary whitespace-nowrap"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      {/* body section */}
      <div>
        {isLoading ? (
          <div className="text-center py-8">Loading account information...</div>
        ) : !userId ? (
          <div className="text-center py-8 text-red-500">
            Please log in to view your account information
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default Account;
