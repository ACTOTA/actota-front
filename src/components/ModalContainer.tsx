// components/ModalContainer.js
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import {Success} from "./modals/Success"; 
import { useSearchParams } from "next/navigation";
import { Loading } from "./modals/Loading";
import CookieBanner from "./modals/CookieBanner";
import ShareModal from "./modals/ShareModal";
import DeletePaymentCard from "./modals/DeletePaymentCard";
import GuestCheckout from "./modals/GuestCheckout";
import Signin from "./modals/Signin";
import Signup from "./modals/Signup";
import BookingConfirmed from "./modals/BookingConfirmed";

export default function ModalContainer() {
    const router = useRouter();
    const openModal = useSearchParams().get("modal");
    const MODALS: { [key: string]: React.ReactNode } = {
        success: <Success />,
        signinLoading: <Loading  text="Signing you in..."/>,
        signupLoading: <Loading  text="Creating your account..."/>,
        loading: <Loading  text="Loading..."/>,
        cookieBanner: <CookieBanner />,
        shareModal: <ShareModal />,
        deletePaymentCard: <DeletePaymentCard />,
        guestCheckout: <GuestCheckout />,
        guestCheckoutLoading: <Loading  text="Processing Your Payment" subText={<>
            Please wait as we process your payment. <br />
            This might take a while...
          </>}/>,
          signin: <Signin />,
          signup: <Signup />,
          bookingConfirmed: <BookingConfirmed />,
    };
    console.log(openModal,"openModal");
   
    if (!openModal) return null; // No modal is open

      const ModalComponent = MODALS[openModal as keyof typeof MODALS];
      const handleClose = () => {
        // router.back();
         router.push(window.location.pathname);
    };
    return (
        <Modal onClose={handleClose} isLoading={openModal === "loading" || openModal === "signinLoading" || openModal === "signupLoading" || openModal === "guestCheckoutLoading"} >
            {ModalComponent}
        </Modal>
    );
}
