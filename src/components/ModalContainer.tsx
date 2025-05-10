// components/ModalContainer.js
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Success } from "./modals/Success";
import { useSearchParams } from "next/navigation";
import { Loading } from "./modals/Loading";
import CookieBanner from "./modals/CookieBanner";
import ShareModal from "./modals/ShareModal";
import DeletePaymentCard from "./modals/DeletePaymentCard";
import GuestCheckout from "./modals/GuestCheckout";
import Signin from "./modals/Signin";
import Signup from "./modals/Signup";
import BookingConfirmed from "./modals/BookingConfirmed";
import PaymentError from "./modals/PaymentError";
import BookingFailure from "./modals/BookingFailure";
import ProcessingPayment from "./modals/ProcessingPayment";
import PaymentPartial from "./modals/PaymentPartial";

export default function ModalContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const openModal = searchParams.get("modal");
    const paymentMethodId = searchParams.get("paymentMethodId") || "";

    const MODALS: { [key: string]: React.ReactNode } = {
        success: <Success />,
        signinLoading: <Loading text="Signing you in..." />,
        signupLoading: <Loading text="Creating your account..." />,
        loading: <Loading text="Loading..." />,
        cookieBanner: <CookieBanner />,
        shareModal: <ShareModal />,
        deletePaymentCard: <DeletePaymentCard paymentMethodId={paymentMethodId} />,
        guestCheckout: <GuestCheckout />,
        guestCheckoutLoading: <Loading text="Processing Your Payment" subText={<>
            Please wait as we process your payment. <br />
            This might take a while...
        </>} />,
        signin: <Signin />,
        signup: <Signup />,
        bookingConfirmed: <BookingConfirmed />,
        // New modals for payment and booking errors
        paymentError: <PaymentError />,
        bookingFailure: <BookingFailure />,
        processingPayment: <ProcessingPayment />,
        paymentFailure: <PaymentError />, // Reuse PaymentError for paymentFailure as well
        paymentPartial: <PaymentPartial />
    };

    if (!openModal) return null; // No modal is open

    const ModalComponent = MODALS[openModal as keyof typeof MODALS];
    const handleClose = () => {
        // router.back();
        router.push(window.location.pathname);
    };
    // Determine if this is a loading modal
    const isLoadingModal = openModal === "loading" ||
                          openModal === "signinLoading" ||
                          openModal === "signupLoading" ||
                          openModal === "guestCheckoutLoading" ||
                          openModal === "processingPayment";

    // Determine if this is an error modal that shouldn't auto-close
    const isErrorModal = openModal === "paymentError" ||
                        openModal === "bookingFailure" ||
                        openModal === "paymentFailure" ||
                        openModal === "paymentPartial";

    return (
        <Modal
            onClose={handleClose}
            isLoading={isLoadingModal}
            persistent={isErrorModal} // Don't allow auto-close for error modals
        >
            {ModalComponent}
        </Modal>
    );
}
