"use client";
import Button from "@/src/components/figma/Button";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import Input from "@/src/components/figma/Input";
import LockIcon from "@/public/sidebar-icons/lock-icon.svg";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

const VerificationPasswor = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  console.log(currentPassword, "currentPassword");
  return (
      <div className="flex items-start max-md:flex-col gap-8 w-full">
        {/* verification */}
        <div className="flex flex-col gap-6 w-1/2 max-md:w-full">
          <div className="font-bold text-xl">Verification</div>
          <div className="flex flex-col gap-2">
            {/* email  */}
            <div className=" flex items-center justify-between p-3 border w-full border-primary-gray max-md:border-none max-md:!bg-none rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
              <div className="flex gap-3 items-center">
                <CiMail className="w-6 h-6" />
                <div>
                  <div className="text-sm font-normal leading-5">Email</div>
                  <div className="font-bold text-base leading-6">
                    user@email.com
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center text-base font-bold leading-6">
                <IoCheckmark className="w-6 h-6" />
                Verified
              </div>
            </div>
            {/* phone  */}
            <div className=" flex items-center justify-between p-3 border w-full border-primary-gray max-md:border-none max-md:!bg-none rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
              <div className="flex gap-3 items-center">
                <CiMail className="w-6 h-6" />
                <div>
                  <div className="text-sm font-normal leading-5">Phone</div>
                  <div className="font-bold text-base leading-6">
                    Unverified
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center text-base font-bold leading-6">
                Verify
                <BsArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
        {/* change password */}
        <div className="flex flex-col gap-4 w-1/2 max-md:w-full">
          <div className="font-bold text-xl">Change Password</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold text-primary-gray">
                Current Password
              </div>
              <Input
                placeholder="Current Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentPassword(e.target.value)
                }
                icon={<LockIcon />}
                type={showPassword ? "text" : "password"}
                widthIcon="w-5 h-5"
                className="px-4 py-3.5 "
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold text-primary-gray">
                New Password
              </div>
              <Input
                placeholder="New Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentPassword(e.target.value)
                }
                icon={<LockIcon />}
                type={showPassword ? "text" : "password"}
                widthIcon="w-5 h-5"
                className="px-4 py-3.5 "
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold text-primary-gray">
                Confirm New Password
              </div>
              <Input
                placeholder="Re-enter your new password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentPassword(e.target.value)
                }
                icon={<LockIcon />}
                type={showPassword ? "text" : "password"}
                widthIcon="w-5 h-5"
                className="px-4 py-3.5 "
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" className="w-fit">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
  );
};

export default VerificationPasswor;
