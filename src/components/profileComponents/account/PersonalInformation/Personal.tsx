"use client";
import React, { useState } from "react";
import Button from "../../../figma/Button";
import { FiEdit3 } from "react-icons/fi";
import Image from "next/image";
import ProfileImage from "@/public/images/Avatar.png";
import { GoDotFill } from "react-icons/go";
import { PlusIcon } from "@heroicons/react/20/solid";
import Input from "@/src/components/figma/Input";
import { FaApple, FaArrowRight, FaCheck, FaFacebook } from "react-icons/fa";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { BsApple, BsArrowRight } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const Personal = () => {
  const [firstName, setFirstName] = useState("");
  console.log(firstName, "firstName");
  return (
    <div className="gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">Personal Information</div>
        <Button variant="outline" size="sm" className="flex gap-2 items-center">
          <FiEdit3 />
          Edit
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src={ProfileImage} alt="Profile" width={80} height={80} />
          <div className="text-white flex flex-col gap-1">
            <div className="font-bold text-base leading-6">Profile Picture</div>
            <div className="flex gap-2 items-center text-sm text-primary-gray">
              <div>JPEG or PNG</div>
              <GoDotFill />
              <div>Recommended 500 x 500px, max 500KB.</div>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 items-center py-2.5 !px-4"
        >
          Upload New Picture <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Legal Name</div>
          <Input
            placeholder="Legal Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Display Name</div>
          <Input
            placeholder="Display Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Email</div>
          <Input
            placeholder="Email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Phone Number</div>
          <Input
            placeholder="Phone Number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Date of Birth</div>
          <Input
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
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl mt-2">Linked Accounts</div>
          <div className="font-normal text-base text-primary-gray">
            By linking a third party site, you’ll be able to directly sign in
            using your third party account information.
          </div>
        </div>

        <div className="flex w-full gap-3">
          <div className=" text-sm font-normal p-3 border w-1/3 border-primary-gray rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
            <div className="flex gap-3 items-center justify-between">
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
          <div className=" text-sm font-normal p-3 border w-1/3 border-primary-gray rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
            <div className="flex gap-3 items-center justify-between">
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
          <div className=" text-sm font-normal p-3 border w-1/3 border-primary-gray rounded-lg bg-gradient-to-l from-primary-gray/20 to-primary-gray/30">
            <div className="flex gap-3 items-center justify-between">
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

        <div className=" text-base font-normal text-primary-gray flex items-center gap-2">
          <span className="border-b-[#F43E62] text-[#F43E62] border-b-2">
            Delete my account
          </span>
          Once deleted, your account information will be removed, this action
          cannot be undone.
        </div>
      </div>
    </div>
  );
};

export default Personal;
