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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.user_id) {
        setUserId(user.user_id);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    } finally {
      setIsCheckingAuth(false);
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
        {isCheckingAuth || isLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading account information...
            </div>
          </div>
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
