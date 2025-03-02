"use client";

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface StripeProviderProps {
  children: React.ReactNode;
}

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const StripeProvider = ({ children }: StripeProviderProps) => {
  if (!stripePromise) {
    console.warn('Stripe has not been initialized. Check your publishable key.');
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;