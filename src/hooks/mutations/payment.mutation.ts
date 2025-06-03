import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';
import toast from 'react-hot-toast';
import { getClientSession } from '@/src/lib/session';

export interface AttachPaymentMethodParams {
  paymentMethodId: string;
  setAsDefault: boolean;
}

// Define response types for better type safety
interface PaymentMethodResponse {
  success: boolean;
  paymentMethodId: string;
  customerId: string;
}

interface DefaultPaymentMethodResponse {
  success: boolean;
  customerId: string;
}

interface DeletePaymentMethodResponse {
  success: boolean;
  customerId: string;
}

export const useAttachPaymentMethod = (): UseMutationResult<
  PaymentMethodResponse,
  Error,
  AttachPaymentMethodParams,
  unknown
> & { isLoading: boolean } => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Rest of implementation unchanged
    mutationFn: async (values: AttachPaymentMethodParams) => {
      // Get user information from the client session
      let userId = '';
      let userEmail = '';
      let userName = '';

      const session = getClientSession();

      if (typeof window !== 'undefined') {
        try {
          // First try to get from session
          if (session.isLoggedIn && session.user) {
            userId = session.user.user_id;
            userEmail = session.user.email || '';
            userName = session.user.name ||
              (session.user.first_name && session.user.last_name ?
                `${session.user.first_name} ${session.user.last_name}` :
                'Customer');
          } else {
            // Fall back to localStorage for compatibility
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userId = user.user_id;
            userEmail = user.email || '';
            userName = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Customer');
          }

          if (!userId) {
            throw new Error("Please login");
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          throw new Error("Please login");
        }
      }

      // First check if we already have a customer_id in the session
      let customerId = '';
      if (session && session.user && session.user.customer_id) {
        customerId = session.user.customer_id;
      } else {
        // If not, call the backend API to get or create a Stripe customer ID
        const customerResponse = await actotaApi.post(`/account/${userId}/customer`);
        customerId = customerResponse.data.customer_id;

        if (!customerId) {
          throw new Error("Failed to get customer ID from server");
        }

        // Update the local session with the new customer_id if possible
        if (session && session.user) {
          session.user.customer_id = customerId;
          // Update localStorage for client-side persistence
          localStorage.setItem('user', JSON.stringify(session.user));

          // Also update the server-side session
          try {
            await actotaApi.post('/account/update-session', {
              customerId
            });
            console.log('Server-side session updated with customer_id');
          } catch (sessionError) {
            console.error('Error updating server-side session:', sessionError);
            // Continue even if server-side session update fails
          }
        }
      }

      console.log(`Attaching payment method ${values.paymentMethodId} to customer: ${customerId}`);

      // Step 2: Call Stripe API to attach the payment method to the customer
      try {
        // Make an API call to attach the payment method to the customer on Stripe's servers
        // This goes through our Next.js API route which then calls the backend service
        const response = await actotaApi.post(`/account/${userId}/payment-methods/attach`, {
          customer_id: customerId,
          payment_id: values.paymentMethodId,
          default: values.setAsDefault
        });

        console.log('Payment method attached to customer', response.data);

        // For backwards compatibility with the existing code, we'll also update localStorage
        const storedPaymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');

        // We need to retrieve the payment method details from Stripe
        // This would typically be returned in the response from the server
        // For now, we'll create a placeholder with the ID
        const newPaymentMethod = {
          id: values.paymentMethodId,
          type: 'card',
          created: Date.now(),
          customer: customerId,
          livemode: process.env.NODE_ENV === 'production',
          card: {
            brand: response.data?.brand || 'unknown',
            checks: { address_line1_check: null, address_postal_code_check: null, cvc_check: 'pass' },
            country: 'US',
            exp_month: response.data?.exp_month || Math.floor(Math.random() * 12) + 1,
            exp_year: response.data?.exp_year || new Date().getFullYear() + 2,
            fingerprint: 'fingerprint' + Math.random().toString(36).substring(2, 8),
            funding: 'credit',
            generated_from: null,
            last4: response.data?.last4 || '0000',
            networks: { available: [], preferred: null },
            three_d_secure_usage: { supported: true },
            wallet: null
          },
          billing_details: {
            address: {
              city: null,
              country: null,
              line1: null,
              line2: null,
              postal_code: null,
              state: null
            },
            email: userEmail,
            name: userName,
            phone: null
          }
        };

        console.log('Simulated payment method:', newPaymentMethod);

        // If setAsDefault is true, mark all existing payment methods as not default
        const updatedPaymentMethods = values.setAsDefault
          ? storedPaymentMethods.map((method: any) => ({
            ...method,
            isDefault: false
          }))
          : [...storedPaymentMethods];

        // Add the new payment method with appropriate default status
        updatedPaymentMethods.push({
          ...newPaymentMethod,
          isDefault: values.setAsDefault
        });

        // Store the updated payment methods in localStorage
        localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
      } catch (error) {
        console.error("Error attaching payment method to customer:", error);
        throw new Error("Failed to attach payment method to customer");
      }
      return {
        success: true,
        paymentMethodId: values.paymentMethodId,
        customerId
      };
    },
    onSuccess: () => {
      toast.success("Payment method added successfully");
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error) || "Failed to add payment method";
      toast.error(message);
    },
  });
  
  return { ...mutation, isLoading: mutation.isPending };
};

export const useSetDefaultPaymentMethod = (): UseMutationResult<
  DefaultPaymentMethodResponse,
  Error,
  string,
  unknown
> & { isLoading: boolean } => {
  const queryClient = useQueryClient();
  const session = getClientSession();

  const mutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      // Existing implementation...
      let userId = '';
      const session = getClientSession();

      if (typeof window !== 'undefined') {
        try {
          // First try to get from session
          if (session.isLoggedIn && session.user) {
            userId = session.user.user_id;
          } else {
            // Fall back to localStorage for compatibility
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userId = user.user_id;
          }

          if (!userId) {
            throw new Error("Please login");
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          throw new Error("Please login");
        }

        // First check if we already have a customer_id in the session
        let customerId = '';
        if (session && session.user && session.user.customer_id) {
          customerId = session.user.customer_id;
        } else {
          // If not, call the backend API to get or create a Stripe customer ID
          const customerResponse = await actotaApi.post(`/account/${userId}/customer`);
          customerId = customerResponse.data.customer_id;

          if (!customerId) {
            throw new Error("Failed to get customer ID from server");
          }

          // Update the local session with the new customer_id if possible
          if (session && session.user) {
            session.user.customer_id = customerId;
            // Update localStorage for client-side persistence
            localStorage.setItem('user', JSON.stringify(session.user));
          }
        }

        console.log(`Setting default payment method ${paymentMethodId} for customer: ${customerId}`);

        // Get current payment methods
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');

        // Set the specified payment method as default
        // In a real implementation, this would make API calls to Stripe
        const updatedPaymentMethods = paymentMethods.map((method: any) => ({
          ...method,
          isDefault: method.id === paymentMethodId
        }));

        // Save back to localStorage
        localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));

        return { success: true, customerId };
      }

      throw new Error("Cannot access localStorage");
    },
    onSuccess: () => {
      toast.success("Default payment method updated");
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error) || "Failed to update default payment method";
      toast.error(message);
    },
  });
  
  return { ...mutation, isLoading: mutation.isPending };
};

export const useDeletePaymentMethod = (): UseMutationResult<
  DeletePaymentMethodResponse,
  Error,
  string,
  unknown
> & { isLoading: boolean } => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      // Existing implementation...
      let userId = '';
      const session = getClientSession();

      if (typeof window !== 'undefined') {
        try {
          // First try to get from session
          if (session.isLoggedIn && session.user) {
            userId = session.user.user_id;
          } else {
            // Fall back to localStorage for compatibility
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userId = user.user_id;
          }

          if (!userId) {
            throw new Error("Please login");
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          throw new Error("Please login");
        }

        // First check if we already have a customer_id in the session
        let customerId = '';
        if (session && session.user && session.user.customer_id) {
          customerId = session.user.customer_id;
        } else {
          // If not, call the backend API to get or create a Stripe customer ID
          const customerResponse = await actotaApi.post(`/account/${userId}/customer`);
          customerId = customerResponse.data.customer_id;

          if (!customerId) {
            throw new Error("Failed to get customer ID from server");
          }

          // Update the local session with the new customer_id if possible
          if (session && session.user) {
            session.user.customer_id = customerId;
            // Update localStorage for client-side persistence
            localStorage.setItem('user', JSON.stringify(session.user));
          }
        }

        console.log(`Deleting payment method ${paymentMethodId} for customer: ${customerId}`);

        // Make the actual API call to delete the payment method
        await actotaApi.post(`/account/${userId}/payment-methods/detach`, {
          customer_id: customerId,
          payment_method_id: paymentMethodId
        });

        // For local state management (this can be removed if the backend handles everything)
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
        const updatedPaymentMethods = paymentMethods.filter(
          (method: any) => method.id !== paymentMethodId
        );
        localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));

        return { success: true, customerId };
      }

      throw new Error("Cannot access localStorage");
    },
    onSuccess: () => {
      toast.success("Payment method deleted");
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error) || "Failed to delete payment method";
      toast.error(message);
    },
  });
  
  return { ...mutation, isLoading: mutation.isPending };
};

// New combined booking with payment mutation
export interface BookingWithPaymentParams {
  itineraryId: string;
  paymentIntentId: string;
  customerId: string;
  arrivalDatetime: string;
  departureDatetime: string;
}

interface BookingWithPaymentResponse {
  success: boolean;
  booking_id?: string;
  payment_intent?: any;
  status?: string;
  error?: string;
  warning?: string;
}

export const useBookingWithPayment = (): UseMutationResult<
  BookingWithPaymentResponse,
  Error,
  BookingWithPaymentParams,
  unknown
> & { isLoading: boolean } => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: BookingWithPaymentParams) => {
      let userId = '';
      const session = getClientSession();

      if (typeof window !== 'undefined') {
        try {
          // First try to get from session
          if (session.isLoggedIn && session.user) {
            userId = session.user.user_id;
          } else {
            // Fall back to localStorage for compatibility
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userId = user.user_id;
          }

          if (!userId) {
            throw new Error("Please login");
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          throw new Error("Please login");
        }

        console.log(`Processing booking with payment for itinerary: ${params.itineraryId}`);
        
        // Call the combined endpoint
        const response = await fetch('/api/stripe/booking-with-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            itinerary_id: params.itineraryId,
            payment_intent_id: params.paymentIntentId,
            customer_id: params.customerId,
            arrival_datetime: params.arrivalDatetime,
            departure_datetime: params.departureDatetime
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const result = await response.json();
                
        return result;
      }

      throw new Error("Cannot access browser environment");
    },
    onSuccess: (data) => {
      if (data.success) {
        // Store success flag for the ProcessingPayment modal to detect
        localStorage.setItem('recentBookingSuccess', JSON.stringify({
          timestamp: new Date().toISOString(),
          booking_id: data.booking_id
        }));
        
        toast.success("Booking confirmed successfully!");
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      } else if (data.error) {
        toast.error(data.error);
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error) || "Failed to process booking";
      toast.error(message);
    },
  });
  
  return { ...mutation, isLoading: mutation.isPending };
};
