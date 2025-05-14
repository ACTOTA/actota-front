"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../figma/Button";
import Personal from "./PersonalInformation/Personal";
import VerificationPasswor from "./VerificationPassword/VerificationPasswor";
import EmailNotification from "./EmailNotification/EmailNotification";
import { useAccountInfo } from "@/src/hooks/queries/account/useAccountQuery";
const Account = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(user);
  }, []);
  
  const { data: accountInfo } = useAccountInfo(user?.user_id || '');
  
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
      <div>{renderContent()}</div>
    </div>
  );
};

export default Account;
