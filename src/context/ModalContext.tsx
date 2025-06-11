'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import ProcessingPayment from '../components/modals/ProcessingPayment';
import BookingFailure from '../components/modals/BookingFailure';
import PaymentError from '../components/modals/PaymentError';
import BookingConfirmed from '../components/modals/BookingConfirmed';
import PaymentPartial from '../components/modals/PaymentPartial';

type ModalType = 
  | 'none'
  | 'processingPayment' 
  | 'bookingFailure' 
  | 'paymentError' 
  | 'paymentFailure'
  | 'bookingConfirmed'
  | 'paymentPartial';

interface ModalContextType {
  modalType: ModalType;
  modalMessage: string;
  showModal: (type: ModalType, message?: string) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  modalType: 'none',
  modalMessage: '',
  showModal: () => {},
  hideModal: () => {}
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>('none');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (type: ModalType, message = '') => {
    setModalType(type);
    setModalMessage(message);
  };

  const hideModal = () => {
    setModalType('none');
    setModalMessage('');
  };

  return (
    <ModalContext.Provider value={{ modalType, modalMessage, showModal, hideModal }}>
      {children}
      {modalType === 'processingPayment' && <ProcessingPayment />}
      {modalType === 'bookingFailure' && <BookingFailure message={modalMessage} />}
      {modalType === 'paymentError' && <PaymentError message={modalMessage} />}
      {modalType === 'paymentFailure' && <PaymentError message={modalMessage} />}
      {modalType === 'bookingConfirmed' && <BookingConfirmed />}
      {modalType === 'paymentPartial' && <PaymentPartial message={modalMessage} />}
    </ModalContext.Provider>
  );
};