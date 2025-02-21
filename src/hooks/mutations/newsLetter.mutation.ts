import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';

interface NewsletterResponse {
  success: boolean;
  message: string;
}

// Subscribe mutation
const useNewsLetterSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await actotaApi.post<NewsletterResponse>(
          '/api/newsletter/subscribe',
          { email }
        );
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onError: (error) => {
      console.error('Newsletter subscription error:', error);
    },
  });
};

// Unsubscribe mutation
const useNewsLetterUnsubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await actotaApi.post<NewsletterResponse>(
          '/api/newsletter/unsubscribe',
          { email }
        );
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onError: (error) => {
      console.error('Newsletter unsubscription error:', error);
    },
  });
};

export { useNewsLetterSubscribe, useNewsLetterUnsubscribe };
  