"use client";
import Button from "@/src/components/figma/Button";
import React, { useState, useCallback } from "react";
import { BsArrowRight } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { IoCheckmark } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import Input from "@/src/components/figma/Input";
import LockIcon from "@/public/sidebar-icons/lock-icon.svg";
import Card from "@/src/components/shared/Card";

interface VerificationPasswordProps {
  data?: {
    email?: string;
    phone?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  };
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const VerificationPasswor: React.FC<VerificationPasswordProps> = ({ data }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation function
  const validatePasswords = useCallback(() => {
    const newErrors: PasswordErrors = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentPassword, newPassword, confirmPassword]);

  const handlePasswordChange = async () => {
    if (!validatePasswords()) return;
    
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccessMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ currentPassword: "Failed to update password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = () => {
    // Handle phone verification logic
    console.log("Verify phone");
  };

  const handleVerifyEmail = () => {
    // Handle email verification resend
    console.log("Resend email verification");
  };

  return (
      <div className="flex items-start max-lg:flex-col gap-6 w-full">
        {/* Verification Section */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          <h2 className="font-bold text-2xl text-white">Verification</h2>
          <div className="flex flex-col gap-4">
            {/* Email Verification */}
            <Card variant="default" noPadding className="hover:border-gray-600">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <CiMail className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-normal text-gray-400">Email</div>
                    <div className="font-semibold text-base text-white truncate" title={data?.email}>
                      {data?.email || "No email provided"}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {data?.emailVerified ? (
                    <div className="flex gap-2 items-center text-green-500">
                      <IoCheckmark className="w-5 h-5" />
                      <span className="font-semibold text-sm">Verified</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleVerifyEmail}
                      className="flex gap-2 items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <span className="font-semibold text-sm">Verify</span>
                      <BsArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Phone Verification */}
            <Card variant="default" noPadding className="hover:border-gray-600">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-normal text-gray-400">Phone</div>
                    <div className="font-semibold text-base text-white truncate" title={data?.phone}>
                      {data?.phone || "No phone number"}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {data?.phoneVerified ? (
                    <div className="flex gap-2 items-center text-green-500">
                      <IoCheckmark className="w-5 h-5" />
                      <span className="font-semibold text-sm">Verified</span>
                    </div>
                  ) : data?.phone ? (
                    <button
                      onClick={handleVerifyPhone}
                      className="flex gap-2 items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <span className="font-semibold text-sm">Verify</span>
                      <BsArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleVerifyPhone}
                      className="flex gap-2 items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <span className="font-semibold text-sm">Add</span>
                      <BsArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          <h2 className="font-bold text-2xl text-white">Change Password</h2>
          
          {successMessage && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">
                Current Password
              </label>
              <div className="relative">
                <Input
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCurrentPassword(e.target.value);
                    if (errors.currentPassword) {
                      setErrors({ ...errors, currentPassword: undefined });
                    }
                  }}
                  icon={<LockIcon className="w-5 h-5 text-gray-400" />}
                  type="password"
                  widthIcon="w-5 h-5"
                  classname={`${errors.currentPassword ? 'border-red-500' : ''}`}
                />
                {errors.currentPassword && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <MdErrorOutline className="w-3 h-3" />
                    {errors.currentPassword}
                  </div>
                )}
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">
                New Password
              </label>
              <div className="relative">
                <Input
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: undefined });
                    }
                  }}
                  icon={<LockIcon className="w-5 h-5 text-gray-400" />}
                  type="password"
                  widthIcon="w-5 h-5"
                  classname={`${errors.newPassword ? 'border-red-500' : ''}`}
                />
                {errors.newPassword && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <MdErrorOutline className="w-3 h-3" />
                    {errors.newPassword}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  icon={<LockIcon className="w-5 h-5 text-gray-400" />}
                  type="password"
                  widthIcon="w-5 h-5"
                  classname={`${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <MdErrorOutline className="w-3 h-3" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-500 mt-2">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Be at least 8 characters long</li>
                <li>Be different from your current password</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button 
              variant="primary" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3"
              onClick={handlePasswordChange}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
  );
};

export default VerificationPasswor;
