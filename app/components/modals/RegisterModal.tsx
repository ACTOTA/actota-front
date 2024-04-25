'use client';

import { Axios } from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {useRegisterModal} from "@/app/hooks/useRegisterModal";
import { register } from "module";
import Modal from "./Modal";

const RegisterModal = () => {
    const RegisterModal = useRegisterModal();
    const {isLoading, setIsLoading} = useState(false);
    
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
    }
    
    const onSubit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        
        axios.post("/api/auth/register", data)
        .then((response) => {
            registerModal.onClose();
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }
    return (  
        <Modal 
        disabled={isLoading}
        isOpen={registerModal.isOpen}
        title="Register"
        actionLabel="Continue"
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        />
    );
}
 
export default RegisterModal;