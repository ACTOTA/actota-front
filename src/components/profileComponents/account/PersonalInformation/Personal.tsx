"use client";
import React, { useState, useEffect } from "react";
import Button from "../../../figma/Button";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import Image from "next/image";
import ProfileImage from "@/public/images/Avatar.png";
import { PlusIcon } from "@heroicons/react/20/solid";
import Input from "@/src/components/figma/Input";
import { FaFacebook } from "react-icons/fa";
import { BsApple, BsArrowRight } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import PhoneInput from 'react-phone-number-input';
import { E164Number, isValidPhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import ProfilePictureUpload from "@/src/components/inputs/ProfilePictureUpload";
import { getClientSession } from "@/src/lib/session";
import actotaApi from '@/src/lib/apiClient';
import { toast } from 'react-hot-toast';
import EmailVerification from "@/src/components/inputs/EmailVerification";
import Modal from "@/src/components/Modal";
import { useQueryClient } from '@tanstack/react-query';
import Card from "@/src/components/shared/Card";

interface PersonalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: E164Number | undefined;
  birthDate: string;
}

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validates input date in MM/DD/YYYY format and also checks if user is 18+
const isValidDate = (date: string): boolean => {
  // Check format MM/DD/YYYY or MM-DD-YYYY
  const regex = /^(0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d\d$/;
  if (!regex.test(date)) return false;
  
  // Check if it's a valid date
  const parts = date.split(/[\/\-]/);
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  const d = new Date(year, month - 1, day);
  const isValid = d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  
  // Check if user is at least 18 years old
  if (isValid) {
    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return d <= minAgeDate;
  }
  
  return false;
};

// Convert a date from MM/DD/YYYY to YYYY-MM-DD format for backend
const formatDateForBackend = (date: string): string => {
  if (!date) return '';
  
  const parts = date.split(/[\/\-]/);
  if (parts.length !== 3) return '';
  
  // Ensure all parts have 2 digits (padding with zero if needed)
  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2];
  
  return `${year}-${month}-${day}`;
};

// Format a date from backend YYYY-MM-DD to MM/DD/YYYY for display
const formatDateForDisplay = (date: string | null | undefined): string => {
  if (!date) return '';
  
  // Check if already in MM/DD/YYYY format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
    return date;
  }
  
  try {
    // Handle ISO date format or YYYY-MM-DD format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return date; // Return original if parsing failed
    }
    
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return date; // Return original on error
  }
};

const Personal = (props: any) => {
  const data = props.data || {};
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<PersonalFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: undefined,
    birthDate: ""
  });
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const session = getClientSession();
  const queryClient = useQueryClient();
  
  // Get userId from localStorage or session
  useEffect(() => {
    try {
      // First try to get it from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.user_id) {
        setUserId(user.user_id);
        return;
      }
      
      // If not in localStorage, try session
      const session = getClientSession();
      if (session?.user?.user_id) {
        setUserId(session.user.user_id);
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  }, []);

  useEffect(() => {
    if (data) {
      // Split the name if it exists, otherwise default to empty strings
      const nameParts = data.first_name ? data.first_name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || data.last_name || "";
      
      // Set form data from API response
      // Note: we're handling both field name cases (phone/phone_number) for compatibility
      setFormData({
        firstName,
        lastName: data.last_name || lastName,
        email: data.email || "",
        phone: data.phone_number || data.phone, // Handle both field name variations
        birthDate: data.birth_date ? formatDateForDisplay(data.birth_date) : "" // Format date for display
      });
      
      if (data.profile_picture) {
        setProfilePicture(data.profile_picture);
      }
    }
  }, [data]);

  const handleInputChange = (field: keyof PersonalFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset email verified status if email is changed
    if (field === 'email' && value !== data?.email) {
      setEmailVerified(false);
    }
    
    // Clear the error for this field as the user is making changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Required fields: first name, last name, and email
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Optional fields: only validate if they contain data
    if (formData.birthDate && !isValidDate(formData.birthDate)) {
      newErrors.birthDate = "Please enter a valid date (MM/DD/YYYY) and ensure you are at least 18 years old";
    }
    
    if (formData.phone && !isValidPhoneNumber(formData.phone.toString())) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    
    // Check if email has changed and needs verification
    if (data.email !== formData.email && !emailVerified) {
      setNewEmail(formData.email);
      setShowEmailVerification(true);
      return;
    }
    
    setIsSaving(true);
    try {
      // Prepare the request data
      const requestData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone ? String(formData.phone) : null, // Ensure it's a string or null
        birth_date: formData.birthDate ? formatDateForBackend(formData.birthDate) : null // Format date or null
      };
      
      // Log the payload for debugging
      console.log("Update profile payload:", JSON.stringify(requestData, null, 2));
      
      const response = await actotaApi.put(`/account/${userId}`, requestData);
      
      // Check if email was changed (comparing with the original email from data)
      const emailChanged = data.email !== formData.email;
      
      if (emailChanged) {
        // Clear all cached data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Clear React Query cache
        queryClient.clear();
        
        // Clear persisted React Query cache
        if (typeof window !== 'undefined') {
          localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
        }
        
        // Show message and redirect to login
        toast.success("Your email has been updated. Please sign in again with your new email address.");
        
        // Perform signout on server side to clear cookies
        await fetch('/api/auth/session', {
          method: 'DELETE',
          credentials: 'include'
        });
        
        // Redirect to login page with message
        setTimeout(() => {
          window.location.href = '/auth/signin?message=email-updated';
        }, 1500);
        
        return; // Exit early, don't update local state
      }
      
      toast.success("Profile updated successfully");
      setEditMode(false);
      setEmailVerified(false); // Reset for next time
      
      // Update the displayed data to reflect saved changes
      if (data) {
        Object.assign(data, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          birth_date: formData.birthDate ? formatDateForBackend(formData.birthDate) : null
        });
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Failed to update profile:", error);
      
      // Log more details about the error
      // Type assertion for Axios error
      const axiosError = error as { response?: { data: any, status: number } };
      if (axiosError.response) {
        console.error("Error response data:", axiosError.response.data);
        console.error("Error response status:", axiosError.response.status);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // If we're exiting edit mode without saving, reset form data to original values
      if (data) {
        const nameParts = data.first_name ? data.first_name.split(" ") : ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || data.last_name || "";
        
        setFormData({
          firstName,
          lastName: data.last_name || lastName,
          email: data.email || "",
          phone: data.phone_number || data.phone, // Match backend field name
          birthDate: data.birth_date ? formatDateForDisplay(data.birth_date) : "" // Format date for display
        });
      }
      setErrors({});
      setEmailVerified(false); // Reset email verification status
    }
    setEditMode(!editMode);
  };

  const handleEmailChangeSuccess = (email: string) => {
    // Update the email in the form data
    setFormData(prev => ({...prev, email}));
    setEmailVerified(true);
    setShowEmailVerification(false);
    toast.success("Email verified! Click 'Save Changes' to update your profile.");
  };

  const handleEmailChangeError = (error: string) => {
    console.error('Email change error:', error);
    toast.error(`Failed to update email: ${error}`);
    setShowEmailVerification(false);
  };

  const renderField = (label: string, value: string, field: keyof PersonalFormData, type: string = "text") => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {editMode ? (
          <>
            <Input
              value={value}
              placeholder={label}
              type={type}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newFormData = { ...formData, [field]: e.target.value };
                setFormData(newFormData);
                
                // Clear the error for this field as the user is making changes
                if (errors[field]) {
                  const newErrors = { ...errors };
                  delete newErrors[field];
                  setErrors(newErrors);
                }
              }}
              className={`!bg-[#0A0A0A] !border-gray-700 !text-white placeholder:!text-gray-500 focus:!border-yellow-500 transition-colors duration-200 ${errors[field] ? "!border-red-500" : ""}`}
            />
            {errors[field] && (
              <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors[field]}
              </div>
            )}
          </>
        ) : (
          <div className="px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg text-gray-100">
            {value || <span className="text-gray-500 italic">Not provided</span>}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col gap-8">
      {editMode && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 py-3 px-6 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-semibold">Edit Mode Active</span>
            <span className="ml-2 text-sm opacity-90">Make your changes and click save when ready</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-white">Personal Information</h2>
        {!editMode && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center !border-gray-700 !text-gray-300 hover:!bg-gray-800 hover:!text-white transition-all duration-200"
            onClick={toggleEditMode}
          >
            <FiEdit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
      {editMode && (
        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center !border-gray-700 !text-gray-300 hover:!bg-gray-800 hover:!text-white transition-all duration-200"
            onClick={toggleEditMode}
          >
            <FiX className="w-4 h-4" />
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="flex gap-2 items-center !bg-yellow-500 !text-black hover:!bg-yellow-400 transition-all duration-200 font-semibold"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FiSave className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
      
      {/* Profile Picture Section */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
        <ProfilePictureUpload
          currentImageUrl={profilePicture}
          onSuccess={(imageUrl) => setProfilePicture(imageUrl)}
        />
      </Card>
      
      {/* Personal Information Form */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
        {renderField("First Name*", formData.firstName, "firstName")}
        {renderField("Last Name*", formData.lastName, "lastName")}
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Email*</label>
          {editMode ? (
            <>
              <Input
                value={formData.email}
                placeholder="Email"
                type="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                className={`!bg-[#0A0A0A] !border-gray-700 !text-white placeholder:!text-gray-500 focus:!border-yellow-500 transition-colors duration-200 ${errors.email ? "!border-red-500" : ""}`}
              />
              {emailVerified && formData.email !== data?.email && (
                <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email verified - click "Save Changes" to update
                </div>
              )}
              {errors.email && (
                <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg text-gray-100">
              {formData.email || <span className="text-gray-500 italic">Not provided</span>}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Phone Number</label>
          {editMode ? (
            <>
              <div className="relative">
                <PhoneInput
                  value={formData.phone}
                  placeholder="Enter phone number"
                  onChange={(value) => {
                    const newFormData = { ...formData, phone: value };
                    setFormData(newFormData);
                    
                    // Clear error when user makes changes
                    if (errors.phone) {
                      const newErrors = { ...errors };
                      delete newErrors.phone;
                      setErrors(newErrors);
                    }
                  }}
                  maxLength={15}
                  international
                  defaultCountry="US"
                  className={`PhoneInputInput px-4 py-3 border rounded-lg !bg-[#0A0A0A] !text-white ${
                    errors.phone ? "!border-red-500" : "!border-gray-700 focus-within:!border-yellow-500"
                  } transition-colors duration-200`}
                  style={{
                    '--PhoneInputCountrySelectArrow-opacity': '0.5',
                    '--PhoneInputCountrySelectArrow-color': '#9CA3AF',
                    '--PhoneInputCountrySelectArrow-marginLeft': '0.5rem',
                    '--PhoneInputCountrySelectArrow-height': '0.5rem',
                    '--PhoneInputCountrySelectArrow-width': '0.5rem',
                  }}
                />
              </div>
              {errors.phone && (
                <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-lg text-gray-100">
              {formData.phone || <span className="text-gray-500 italic">Not provided</span>}
            </div>
          )}
        </div>
        
        {renderField("Date of Birth (MM/DD/YYYY)", formData.birthDate, "birthDate")}
        </div>
      </Card>

      {/* Account Actions */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-400">
            <span className="text-yellow-500">*</span> Required fields
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <button className="text-red-400 hover:text-red-300 transition-colors duration-200 underline underline-offset-2">
              Delete my account
            </button>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">
              Once deleted, your account information will be removed. This action cannot be undone.
            </span>
          </div>
        </div>
      </div>
      
      {editMode && (
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-800">
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="md"
              className="flex gap-2 items-center !border-gray-700 !text-gray-300 hover:!bg-gray-800 hover:!text-white transition-all duration-200 min-w-[120px]"
              onClick={toggleEditMode}
            >
              <FiX className="w-4 h-4" />
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="md"
              className="flex gap-2 items-center !bg-yellow-500 !text-black hover:!bg-yellow-400 transition-all duration-200 font-semibold min-w-[140px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              <FiSave className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showEmailVerification && (
        <Modal
          onClose={() => setShowEmailVerification(false)}
          isLoading={false}
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Verify New Email</h2>
            <EmailVerification
              mode="email-change"
              userId={session?.user?.user_id}
              token={session?.accessToken}
              initialEmail={newEmail}
              onSuccess={handleEmailChangeSuccess}
              onError={handleEmailChangeError}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Personal;
