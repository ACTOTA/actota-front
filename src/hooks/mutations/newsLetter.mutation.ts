import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';
import { toast } from 'react-hot-toast';
interface NewsletterResponse {
  success: boolean;
  message: string;
}

// Subscribe mutation
const useNewsLetterSubscribe = () => {
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await actotaApi.post<NewsletterResponse>(
          '/newsletter/subscribe',
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

  return { ...mutation, isLoading: mutation.isPending };
};

// Unsubscribe mutation
const useNewsLetterUnsubscribe = () => {
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await actotaApi.put<NewsletterResponse>(
          '/newsletter/unsubscribe',
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

  return { ...mutation, isLoading: mutation.isPending };
};

export { useNewsLetterSubscribe, useNewsLetterUnsubscribe };
  