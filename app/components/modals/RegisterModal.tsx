'use client';

import axios, { Axios } from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useregisterModal from "@/app/hooks/useRegisterModal";
import { register } from "module";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "@/app/components/inputs/input";
import { toast } from "react-hot-toast";




const RegisterModal = () => {
    const registerModal = useregisterModal();
    const [isLoading, setIsLoading] = useState(false);
    
    const{
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
   
    
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        
        axios.post("/api/auth/register", data)
        .then(() => {
            registerModal.onClose();
        })
        .catch((error) => {
            toast.error('Something Went Wrong');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading 
                title="Welcome to ACTOTA"
                subtitle="Create an account to continue"
                center
            />
            <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />
            <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )
    return (  
        <Modal 
        disabled={isLoading}
        isOpen={registerModal.isOpen}
        title="Register"
        actionLabel="Continue"
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        />
    );
}
 
export default RegisterModal;