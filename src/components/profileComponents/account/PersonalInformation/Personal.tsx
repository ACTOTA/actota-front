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
  const session = getClientSession();
  const userId = session?.user?.id || "";

  useEffect(() => {
    if (data) {
      // Split the name if it exists, otherwise default to empty strings
      const nameParts = data.first_name ? data.first_name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || data.last_name || "";
      
      setFormData({
        firstName,
        lastName: data.last_name || lastName,
        email: data.email || "",
        phone: data.phone,
        birthDate: data.birth_date || ""
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
    
    setIsSaving(true);
    try {
      // API call to update user data
      // This should be replaced with the actual endpoint
      await actotaApi.put(`/api/account/${userId}/update-customer-id`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birthDate
      });
      
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Failed to update profile:", error);
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
          phone: data.phone,
          birthDate: data.birth_date || ""
        });
      }
      setErrors({});
    }
    setEditMode(!editMode);
  };

  const renderField = (label: string, value: string, field: keyof PersonalFormData, type: string = "text") => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm font-bold">{label}</div>
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
              className={errors[field] ? "border-red-500" : ""}
            />
            {errors[field] && (
              <div className="text-red-500 text-xs mt-1">{errors[field]}</div>
            )}
          </>
        ) : (
          <div className="p-2.5 border border-primary-gray rounded-lg text-white">
            {value || "Not provided"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">Personal Information</div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-2 items-center max-md:hidden"
          onClick={editMode ? handleSave : toggleEditMode}
          disabled={isSaving}
        >
          {editMode ? (
            <>
              <FiSave />
              {isSaving ? "Saving..." : "Save"}
            </>
          ) : (
            <>
              <FiEdit3 />
              Edit
            </>
          )}
        </Button>
      </div>
      
      {editMode && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-2 items-center max-md:hidden self-end"
          onClick={toggleEditMode}
        >
          <FiX />
          Cancel
        </Button>
      )}
      
      <ProfilePictureUpload
        currentImageUrl={profilePicture}
        onSuccess={(imageUrl) => setProfilePicture(imageUrl)}
      />
      
      <div className="grid grid-cols-2 max-md:flex max-md:flex-col gap-6">
        {renderField("First Name", formData.firstName, "firstName")}
        {renderField("Last Name", formData.lastName, "lastName")}
        
        {renderField("Email", formData.email, "email", "email")}
        
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Phone Number</div>
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
                  className={`PhoneInputInput focus-within:border-white px-4 border rounded-lg !bg-transparent ${
                    errors.phone ? "border-red-500" : "border-primary-gray"
                  }`}
                  style={{
                    '--PhoneInputCountrySelectArrow-opacity': '1',
                    '--PhoneInputCountrySelectArrow-color': 'white',
                    '--PhoneInputCountrySelectArrow-marginLeft': '1rem',
                    '--PhoneInputCountrySelectArrow-height': '7px',
                    '--PhoneInputCountrySelectArrow-width': '7px',
                  }}
                />
              </div>
              {errors.phone && (
                <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
              )}
            </>
          ) : (
            <div className="p-2.5 border border-primary-gray rounded-lg text-white">
              {formData.phone || "Not provided"}
            </div>
          )}
        </div>
        
        {renderField("Date of Birth (MM/DD/YYYY)", formData.birthDate, "birthDate")}
        
        <div className="flex flex-col gap-2 w-fit">
          <div className="text-sm font-bold">Emergency Contact</div>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 items-center py-3.5 !px-5"
            disabled={!editMode}
          >
            Add <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className=" text-base font-normal text-primary-gray flex flex-wrap items-center gap-2">
          <span className="border-b-[#F43E62] text-[#F43E62] border-b-2 cursor-pointer">
            Delete my account
          </span>
          Once deleted, your account information will be removed, this action
          cannot be undone.
        </div>
      </div>
      
      {editMode && (
        <div className="flex justify-end mt-4">
          <Button 
            variant="primary" 
            size="lg"
            className="flex gap-2 items-center"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Personal;