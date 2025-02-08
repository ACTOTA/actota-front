"use client";
import Toggle from "@/src/components/Toggle/Toggle";
import React, { useState } from "react";

const EmailNotification = () => {
  const [accountActivities, setAccountActivities] = useState(true);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [travelTips, setTravelTips] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [actotaUpdates, setActotaUpdates] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="font-bold text-2xl">Email Notifications</div>
      <div className="flex gap-8">
        <Toggle enabled={accountActivities} setEnabled={setAccountActivities} />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-base leading-6">
            Account Activities
          </div>
          <div className="text-sm text-primary-gray leading-5 ">
            Confirm your booking and account activity, and learn about important
            policies.
          </div>
        </div>
      </div>
      {/* Account Activities */}
      <div className="flex gap-8">
        <Toggle enabled={bookingUpdates} setEnabled={setBookingUpdates} />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-base leading-6">
            Account Activities
          </div>
          <div className="text-sm text-primary-gray leading-5 ">
            Confirm your booking and account activity, and learn about important
            policies.
          </div>
        </div>
      </div>
      {/* Reminders */}
      <div className="flex gap-8">
        <Toggle enabled={reminders} setEnabled={setReminders} />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-base leading-6">Reminders</div>
          <div className="text-sm text-primary-gray leading-5 ">
            Get important reminders about your bookings.
          </div>
        </div>
      </div>
      {/* Travel Tips */}
      <div className="flex gap-8">
        <Toggle enabled={travelTips} setEnabled={setTravelTips} />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-base leading-6">Travel Tips</div>
          <div className="text-sm text-primary-gray leading-5 ">
            Inspire your trip with personalized recommendations.
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <Toggle enabled={specialOffers} setEnabled={setSpecialOffers} />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-base leading-6">Special Offers</div>
          <div className="text-sm text-primary-gray leading-5 ">
            Inspire your trip with personalized special offers.
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <Toggle enabled={actotaUpdates} setEnabled={setActotaUpdates} />
        <div className="flex flex-col gap-1">
          <div className="font-bold text-base leading-6">ACTOTA Updates</div>
          <div className="text-sm text-primary-gray leading-5 ">
            Stay up to date on the latest news from us.
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          className="border-primary-gray bg-transparent focus:ring-0 focus:ring-offset-0 rounded h-5 w-5"
        />
        <div className="text-primary-gray text-base">
          Unsubscribe from all marketing emails.
        </div>
      </div>
    </div>
  );
};

export default EmailNotification;
