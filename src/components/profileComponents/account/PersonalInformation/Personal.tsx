"use client";
import React, { useState, useEffect } from "react";
import Button from "../../../figma/Button";
import { FiEdit3 } from "react-icons/fi";
import Image from "next/image";
import ProfileImage from "@/public/images/Avatar.png";
import { GoDotFill } from "react-icons/go";
import { PlusIcon } from "@heroicons/react/20/solid";
import Input from "@/src/components/figma/Input";
import { FaApple, FaArrowRight, FaCheck, FaFacebook } from "react-icons/fa";
import { BsApple, BsArrowRight } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js'
import 'react-phone-number-input/style.css'
import ProfilePictureUpload from "@/src/components/inputs/ProfilePictureUpload";
import { getClientSession } from "@/src/lib/session";
import EmailVerification from "@/src/components/inputs/EmailVerification";
import Modal from "@/src/components/Modal";

const Personal = (data: any) => {
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const session = getClientSession();

  useEffect(() => {
    // Set the profile picture from the user data if available
    if (data?.data?.profile_picture) {
      setProfilePicture(data.data.profile_picture);
    }
  }, [data?.data?.profile_picture]);

  const handleEmailChangeSuccess = (email: string) => {
    // Update the email in the UI
    setNewEmail(email);
    setShowEmailVerification(false);
    setIsEditingEmail(false);
    // You may want to trigger a data refresh here or update the parent component
    window.location.reload(); // Simple reload to refresh data
  };

  const handleEmailChangeError = (error: string) => {
    console.error('Email change error:', error);
    setShowEmailVerification(false);
  };
  return (
    <div className="gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">Personal Information</div>
        <Button variant="outline" size="sm" className="flex gap-2 items-center max-md:hidden">
          <FiEdit3 />
          Edit
        </Button>
      </div>
      <ProfilePictureUpload
        currentImageUrl={profilePicture}
        onSuccess={(imageUrl) => setProfilePicture(imageUrl)}
      />
      <div className="grid grid-cols-2 max-md:flex max-md:flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Legal Name</div>
          <Input
            value={data?.data?.first_name}
            placeholder="Legal Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Display Name</div>
          <Input
            value={data?.data?.last_name}
            placeholder="Display Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Email</div>
          <div className="flex gap-2">
            <Input
              value={isEditingEmail ? newEmail : data?.data?.email}
              placeholder="Email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (isEditingEmail) {
                  setNewEmail(e.target.value);
                }
              }}
              disabled={!isEditingEmail}
            />
            {!isEditingEmail ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditingEmail(true);
                  setNewEmail(data?.data?.email || '');
                }}
              >
                <FiEdit3 />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (newEmail !== data?.data?.email) {
                      setShowEmailVerification(true);
                    }
                  }}
                  disabled={newEmail === data?.data?.email}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingEmail(false);
                    setNewEmail('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Phone Number</div>
          <div className="relative">
            <PhoneInput
              // value={phoneNumber}
              placeholder="Enter phone number"
              value={data?.data?.phone}
              onChange={setPhoneNumber}
              maxLength={15}
              international
              defaultCountry="US"
              className= "PhoneInputInput focus-within:border-white px-4 border border-primary-gray rounded-lg !bg-transparent "
              style={{
                '--PhoneInputCountrySelectArrow-opacity': '1',
                '--PhoneInputCountrySelectArrow-color': 'white',
                '--PhoneInputCountrySelectArrow-marginLeft': '1rem',
                '--PhoneInputCountrySelectArrow-height': '7px',
                '--PhoneInputCountrySelectArrow-width': '7px',
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Date of Birth</div>
          <Input
            value={data?.data?.birth_date || ''}
            placeholder="Date of Birth"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2 w-fit">
          <div className="text-sm font-bold">Emergency Contact</div>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 items-center py-3.5 !px-5"
          >
            Add <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/*<div className="flex flex-col gap-2">
          <div className="font-bold text-xl mt-2">Linked Accounts</div>
          <div className="font-normal text-base text-primary-gray">
            By linking a third party site, you'll be able to directly sign in
            using your third party account information.
          </div>
        </div>

        <div className="flex max-md:flex-col w-full gap-3">
          <div className=" text-sm font-normal p-3 border w-1/3 max-md:w-full border-primary-gray max-md:border-none max-md:!bg-none rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
            <div className="flex w-full gap-3 items-center justify-between">
              <div className="flex gap-3 items-center">
                <BsApple className="w-5 h-5" />
                Apple
              </div>
              <div className="flex gap-2 items-center">
                <IoCheckmark className="w-5 h-5" />
                Linked
              </div>
            </div>
          </div>
          <div className=" text-sm font-normal p-3 border w-1/3 max-md:w-full border-primary-gray max-md:border-none max-md:!bg-none rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
            <div className="flex w-full gap-3 items-center justify-between">
              <div className="flex gap-3 items-center">
                <FcGoogle className="w-5 h-5" />
                Google
              </div>
              <div className="flex gap-2 items-center font-bold">
                Link
                <BsArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className=" text-sm font-normal p-3 border w-1/3 max-md:w-full border-primary-gray max-md:border-none max-md:!bg-none rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
            <div className="flex w-full gap-3 items-center justify-between">
              <div className="flex gap-3 items-center">
                <FaFacebook className="w-5 h-5 text-blue-500 bg-white rounded-full" />
                Facebook
              </div>
              <div className="flex gap-2 items-center font-bold">
                Link
                <BsArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        */}
        <div className=" text-base font-normal text-primary-gray flex flex-wrap items-center gap-2">
          <span className="border-b-[#F43E62] text-[#F43E62] border-b-2">
            Delete my account
          </span>
          Once deleted, your account information will be removed, this action
          cannot be undone.
        </div>
      </div>

      {/* Email Verification Modal */}
      <Modal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        title="Verify New Email"
      >
        <EmailVerification
          mode="email-change"
          userId={session?.user?.id}
          token={session?.jwt}
          initialEmail={newEmail}
          onSuccess={handleEmailChangeSuccess}
          onError={handleEmailChangeError}
        />
      </Modal>
    </div>
  );
};

export default Personal;
