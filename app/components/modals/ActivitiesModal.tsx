'use client';

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple, AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/input";
import Heading from "../Heading";
import Button from "../Button";
import Activities from "../Activities";
import useActivitiesModal from "@/app/hooks/useActivitiesModal";

const ActivitiesModal = () => {
    
  const activitiesModal = useActivitiesModal();

  useEffect(() => {
    console.log("ActivitiesModal");
  }, []);



  return (
    <Modal
          isOpen={activitiesModal.isOpen}
          title="Activities"
          actionLabel="Continue"
          onClose={activitiesModal.onClose}
          body={<Activities />} 
          onSubmit={function (): void {
              throw new Error("Function not implemented.");
          } }    />
  );
}

export default ActivitiesModal;
