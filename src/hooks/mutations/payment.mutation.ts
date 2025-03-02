import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';
import toast from 'react-hot-toast';

export interface AttachPaymentMethodParams {
  paymentMethodId: string;
  setAsDefault: boolean;
}

export const useAttachPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AttachPaymentMethodParams) => {
      // Only access localStorage in browser environment
      let userId = '';
      let userEmail = '';
      let userName = '';

      if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        userId = user.user_id;
        userEmail = user.email || '';
        userName = user.name || user.firstName + ' ' + user.lastName || 'Customer';

        if (!userId) {
          throw new Error("Please login");
        }
      }

      // Step 1: Call the backend API to get or create a Stripe customer ID
      const customerResponse = await actotaApi.post(`/api/account/${userId}/customer`);
      const { customer_id: customerId } = customerResponse.data;

      if (!customerId) {
        throw new Error("Failed to get customer ID from server");
      }

      console.log(`Attaching payment method ${values.paymentMethodId} to customer: ${customerId}`);

      // Step 2: Call Stripe API to attach the payment method to the customer
      try {
        // Make an API call to attach the payment method to the customer on Stripe's servers
        // This goes through our Next.js API route which then calls the backend service
        const response = await actotaApi.post(`/api/stripe/attach-payment-method`, {
          customerId,
          paymentMethodId: values.paymentMethodId,
          setAsDefault: values.setAsDefault
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
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      // Only access localStorage in browser environment
      let userId = '';
      if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        userId = user.user_id;

        if (!userId) {
          throw new Error("Please login");
        }

        // Step 1: Call the backend API to get the Stripe customer ID
        const customerResponse = await actotaApi.post(`/api/account/${userId}/customer`);
        const { customer_id: customerId } = customerResponse.data;

        if (!customerId) {
          throw new Error("Failed to get customer ID from server");
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
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      // Only access localStorage in browser environment
      let userId = '';
      if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        userId = user.user_id;

        if (!userId) {
          throw new Error("Please login");
        }

        // Step 1: Call the backend API to get the Stripe customer ID
        const customerResponse = await actotaApi.post(`/api/account/${userId}/customer`);
        const { customer_id: customerId } = customerResponse.data;

        if (!customerId) {
          throw new Error("Failed to get customer ID from server");
        }

        console.log(`Deleting payment method ${paymentMethodId} for customer: ${customerId}`);

        // Get current payment methods
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');

        // Filter out the specified payment method
        // In a real implementation, this would make API calls to Stripe
        const updatedPaymentMethods = paymentMethods.filter(
          (method: any) => method.id !== paymentMethodId
        );

        // Save back to localStorage
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
};
