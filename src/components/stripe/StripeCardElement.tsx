"use client";

import React, { useEffect, useState } from 'react';
import Button from '../figma/Button';
import actotaApi from '@/src/lib/apiClient';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCardElementProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: any) => void;
  setAsDefault: boolean;
  cardHolderName: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void; // Keeping for backward compatibility
}

const StripeCardForm = ({
  onSuccess,
  onError,
  setAsDefault,
  cardHolderName,
  isSubmitting,
  setIsSubmitting
}: StripeCardElementProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string>('');
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const getCustomerId = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Use safe localStorage wrapper
          const { getLocalStorageItem } = await import('@/src/utils/browserStorage');
          const user = JSON.parse(getLocalStorageItem('user') || '{}');

          if (!user.customer_id) {
            const userId = user.user_id;

            if (!userId) {
              setCardError('Please login to add a payment method');
              return;
            }

            const response = await actotaApi.post(`/api/account/${userId}/customer`);
            const { customer_id } = response.data;

            if (customer_id) {
              setCustomerId(customer_id);
            }
          } else {
            setCustomerId(user.customer_id);
          }


        }
      } catch (error) {
        console.error('Error fetching customer ID:', error);
        setCardError('Unable to prepare payment form. Please try again.');
      }
    };

    getCustomerId();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCardError('');

    console.log('starting submit');


    if (!stripe || !elements) {
      setCardError('Stripe has not been initialized');
      setIsSubmitting(false);
      return;
    }

    if (!cardHolderName.trim()) {
      setCardError('Please enter the cardholder name');
      setIsSubmitting(false);
      return;
    }

    if (!customerId) {
      setCardError('Customer ID not available, please try again');
      setIsSubmitting(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Card element not found');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardHolderName,
        },
      });

      if (error) {
        setCardError(error.message || 'An error occurred with your card');
        setIsSubmitting(false);
        onError(error);
        return;
      }

      if (paymentMethod && paymentMethod.id) {
        console.log(`Created payment method ${paymentMethod.id} for customer ${customerId}`);

        // Attach the payment method to the customer via your backend
        try {
          // Get the user ID for the API call
          const { getLocalStorageItem } = await import('@/src/utils/browserStorage');
          const user = JSON.parse(getLocalStorageItem('user') || '{}');
          const userId = user.user_id;

          const attachResponse = await actotaApi.post(`/api/account/${userId}/payment-methods`, {
            payment_method_id: paymentMethod.id,
            customer_id: customerId,
            set_as_default: setAsDefault
          });

          if (attachResponse.status === 200) {
            // Successfully attached payment method to customer

            // Update the session with the customer_id
            try {
              await actotaApi.post('/api/account/update-session', {
                customerId
              });

              // Also update the local storage user data
              const userObj = JSON.parse(getLocalStorageItem('user') || '{}');
              userObj.customer_id = customerId;
              const { setLocalStorageItem } = await import('@/src/utils/browserStorage');
              setLocalStorageItem('user', JSON.stringify(userObj));

              console.log('Session and localStorage updated with customer_id');
            } catch (sessionError) {
              console.error('Error updating session with customer_id:', sessionError);
              // Continue even if session update fails
            }

            onSuccess(paymentMethod.id);
          } else {
            throw new Error('Failed to attach payment method to customer');
          }
        } catch (attachError) {
          console.error('Error attaching payment method:', attachError);
          setCardError('Failed to save your card. Please try again.');
          onError(attachError);
        }
      } else {
        throw new Error('No payment method returned');
      }
    } catch (err) {
      console.error('Error creating payment method:', err);
      setCardError('An unexpected error occurred');
      onError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="bg-[#141414] rounded-md p-4 border border-gray-600">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-1">Card Information</p>
              <div className="w-full p-3 border border-gray-600 rounded-md bg-black">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#FFFFFF',
                        '::placeholder': {
                          color: '#AAAAAA',
                        },
                      },
                      invalid: {
                        color: '#FF5555',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {cardError && (
          <div className="mt-2 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
            {cardError}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-[10px]">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !stripe || !elements || !customerId}
        >
          {isSubmitting ? 'Processing...' : 'Save Card'}
        </Button>
      </div>
    </div>
  );
};

// Load stripe outside of the component tree for performance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// This is the wrapper component that provides Stripe context
const StripeCardElement = (props: StripeCardElementProps) => {
  if (!stripePromise) {
    console.error('Stripe has not been initialized. Check your publishable key.');
    return (
      <div className="text-red-500">
        Stripe integration is not configured. Please contact support.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm {...props} />
    </Elements>
  );
};

export default StripeCardElement;
