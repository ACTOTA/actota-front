'use client';

import React, { useState, useEffect } from 'react';
import CodeInput from './CodeInput';

interface EmailVerificationProps {
  onSuccess: (email: string) => void;
  onError: (error: string) => void;
  mode: 'signup' | 'email-change';
  userId?: string;
  initialEmail?: string;
  token?: string;
}

type Step = 'email-input' | 'verify-code' | 'success';

export default function EmailVerification({
  onSuccess,
  onError,
  mode,
  userId,
  initialEmail = '',
  token
}: EmailVerificationProps) {
  const [step, setStep] = useState<Step>(mode === 'signup' && initialEmail ? 'verify-code' : 'email-input');
  const [email, setEmail] = useState(initialEmail);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Auto-send verification code for signup mode when component mounts
  useEffect(() => {
    if (mode === 'signup' && initialEmail && step === 'verify-code' && !verificationId) {
      handleEmailSubmit(new Event('submit') as any);
    }
  }, [mode, initialEmail, step, verificationId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && step === 'verify-code') {
      setCanResend(true);
    }
  }, [countdown, step]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === 'string') return error;
    
    switch (error?.error || error?.message) {
      case 'invalid_code':
        return 'Invalid verification code. Please try again.';
      case 'code_expired':
        return 'Verification code has expired. Please request a new one.';
      case 'send_failed':
        return 'Failed to send verification email. Please try again.';
      case 'invalid_user_id':
        return 'Invalid user. Please log in again.';
      case 'verification_not_found':
        return 'Verification not found. Please request a new code.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === 'signup' 
        ? '/api/email-verifications'
        : `/api/users/${userId}/email-verifications`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (mode === 'email-change' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Email verification response:', result); // Debug log
        const data = result.data || result; // Handle wrapped response
        
        if (!data.id) {
          console.error('No verification ID in response:', data);
          setError('Failed to create verification. Please try again.');
          return;
        }
        
        setVerificationId(data.id);
        setStep('verify-code');
        setCountdown(60);
        setCanResend(false);
      } else {
        const errorData = await response.json();
        setError(getErrorMessage(errorData));
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (code.length !== 6) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === 'signup'
        ? `/api/email-verifications?id=${verificationId}`
        : `/api/users/${userId}/email-verifications/${verificationId}`;

      console.log('Submitting code to endpoint:', endpoint);
      console.log('Verification ID:', verificationId);
      console.log('Code:', code);

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (mode === 'email-change' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        setStep('success');
        setTimeout(() => {
          onSuccess(email);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(getErrorMessage(errorData));
        setCode('');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(60);
    setError(null);
    
    await handleEmailSubmit(new Event('submit') as any);
  };

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Email Verified!</h3>
        <p className="text-gray-300 mt-2">Your email has been successfully verified.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {step === 'email-input' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Verify Your Email</h3>
            <p className="text-sm text-gray-300">
              We've sent a verification code to
            </p>
            <p className="text-sm font-medium text-white mt-1">{email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-300 text-center mb-4">
              Enter the 6-digit code
            </p>
            <CodeInput
              length={6}
              value={code}
              onChange={(value) => {
                setCode(value);
                if (value.length === 6 && !loading) {
                  handleCodeSubmit();
                }
              }}
              disabled={loading}
              error={!!error}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Manual verify button */}
          {code.length === 6 && (
            <button
              type="button"
              onClick={handleCodeSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep('email-input');
                setCode('');
                setError(null);
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Change email
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || loading}
              className="text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {canResend ? 'Resend code' : `Resend in ${countdown}s`}
            </button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <span className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}