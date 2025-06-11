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
    <div className="min-h-screen">
      {/* header section */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-white mb-6">Account Settings</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-800">
          <div className="flex gap-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`
                  px-6 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? "text-white border-yellow-500 bg-gray-800/50"
                    : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600"
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-[#141414] rounded-lg border border-gray-800 p-4 md:p-8">
        {isCheckingAuth || isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center text-gray-300">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">Loading account information...</span>
            </div>
          </div>
        ) : !userId ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg">
              Please log in to view your account information
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
