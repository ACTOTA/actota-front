import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/src/lib/session';

interface EmailVerificationRequest {
  email: string;
}

interface EmailVerificationResponse {
  id: string;
  email: string;
  expires_at: string;
  created_at: string;
}

interface VerifyCodeRequest {
  code: string;
}

interface VerifyCodeResponse {
  verified: boolean;
  email: string;
  verified_at: string;
}

// Signup flow mutations (no auth required)
export const useRequestVerificationMutation = () => {
  return useMutation<EmailVerificationResponse, Error, EmailVerificationRequest>({
    mutationFn: async ({ email }) => {
      const response = await fetch('/api/email-verifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send verification email');
      }

      const result = await response.json();
      return result.data || result; // Handle both wrapped and unwrapped responses
    },
  });
};

export const useVerifyCodeMutation = () => {
  return useMutation<VerifyCodeResponse, Error, { verificationId: string; code: string }>({
    mutationFn: async ({ verificationId, code }) => {
      const response = await fetch(`/api/email-verifications?id=${verificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Invalid verification code');
      }

      const result = await response.json();
      return result.data || result; // Handle both wrapped and unwrapped responses
    },
  });
};

// Email change flow mutations (auth required)
export const useRequestEmailChangeMutation = () => {
  const { session } = useSession();
  
  return useMutation<EmailVerificationResponse, Error, { userId: string; email: string }>({
    mutationFn: async ({ userId, email }) => {
      if (!session?.accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/users/${userId}/email-verifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send verification email');
      }

      return response.json();
    },
  });
};

export const useVerifyEmailChangeMutation = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  
  return useMutation<VerifyCodeResponse, Error, { userId: string; verificationId: string; code: string }>({
    mutationFn: async ({ userId, verificationId, code }) => {
      if (!session?.accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/users/${userId}/email-verifications/${verificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid verification code');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate user queries to refresh email
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });
};

export const useCheckPendingVerificationsMutation = () => {
  const { session } = useSession();
  
  return useMutation<EmailVerificationResponse[], Error, { userId: string }>({
    mutationFn: async ({ userId }) => {
      if (!session?.accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/users/${userId}/email-verifications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check pending verifications');
      }

      return response.json();
    },
  });
};
