'use client';
import React, { useState } from 'react';
import Input from '@/src/components/figma/Input';
import Button from '@/src/components/figma/Button';
import Link from 'next/link';
import GlassPanel from '@/src/components/figma/GlassPanel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@/src/hooks/mutations/auth.mutation';
import { getAuthCookie } from '@/src/helpers/auth';
import EmailVerification from '@/src/components/inputs/EmailVerification';

export default function SignUp() {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await getAuthCookie();
      if (authStatus) {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  const validateForm = () => {
    let tempErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    let isValid = true;

    // Full Name validation
    if (!formData.firstName) {
      tempErrors.firstName = 'Please enter your full name.';
      isValid = false;
    } else if (formData.firstName.length < 2) {
      tempErrors.firstName = 'Name must be at least 2 characters long.';
      isValid = false;
    }

    if (!formData.lastName) {
      tempErrors.lastName = 'Please enter your last name.';
      isValid = false;
    } else if (formData.lastName.length < 2) {
      tempErrors.lastName = 'Name must be at least 2 characters long.';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      tempErrors.email = 'Please provide your email.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = 'Please enter your password.';
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Check if email needs verification
    if (!emailVerified || verifiedEmail !== formData.email) {
      setShowEmailVerification(true);
      return;
    }

    signUp(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      },
      {
        onSuccess: (data: any) => {
          // Log the data structure to debug
          console.log('Signup success data:', JSON.stringify(data, null, 2));
          
          const userData = data.data;
          localStorage.setItem('user', JSON.stringify({
            user_id: userData.user_id || userData._id?.$oid,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            customer_id: userData.customer_id
          }));

          // Store auth token if available
          if (data.auth_token) {
            localStorage.setItem('token', data.auth_token);
          }

          // Redirect to home page after successful signup
          router.push('/');
        },
        onError: (error: any) => {
          // Check if the error is due to duplicate email
          if (error?.response?.status === 409 || error?.message?.toLowerCase().includes('already exists')) {
            setErrors(prev => ({
              ...prev,
              email: 'This email is already registered. Please sign in or use a different email.'
            }));
          } else {
            setErrors(prev => ({
              ...prev,
              email: 'Failed to create account. Please try again.'
            }));
          }
        }
      }
    );
  };

  const handleEmailVerificationSuccess = (email: string) => {
    setEmailVerified(true);
    setVerifiedEmail(email);
    setFormData(prev => ({ ...prev, email }));
    setIsCreatingAccount(true);
    
    // Automatically create the account after email verification
    signUp(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: email,
        password: formData.password
      },
      {
        onSuccess: (data: any) => {
          // Log the data structure to debug
          console.log('Signup success data:', JSON.stringify(data, null, 2));
          
          const userData = data.data;
          localStorage.setItem('user', JSON.stringify({
            user_id: userData.user_id || userData._id?.$oid,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            customer_id: userData.customer_id
          }));

          // Store auth token if available
          if (data.auth_token) {
            localStorage.setItem('token', data.auth_token);
          }

          // Redirect to home page after successful signup
          router.push('/');
        },
        onError: (error: any) => {
          setIsCreatingAccount(false);
          setShowEmailVerification(false);
          // Check if the error is due to duplicate email
          if (error?.response?.status === 409 || error?.message?.toLowerCase().includes('already exists')) {
            setErrors(prev => ({
              ...prev,
              email: 'This email is already registered. Please sign in or use a different email.'
            }));
          } else {
            setErrors(prev => ({
              ...prev,
              email: 'Failed to create account. Please try again.'
            }));
          }
        }
      }
    );
  };

  const handleEmailVerificationError = (error: string) => {
    setErrors(prev => ({ ...prev, email: error }));
    setShowEmailVerification(false);
  };



  const handleGoogleLogin = async () => {
    // Don't show loading modal for Google login, just redirect directly
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    } catch (error) {
      router.back();
      console.error('Google login error:', error);
    }
  };

  const handleAppleLogin = async () => {
    // router.push("?modal=signinLoading");
    try {
      // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/apple`;
    } catch (error) {
      router.back();
      console.error('Apple login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    // router.push("?modal=signinLoading");
    try {
      // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook`;
    } catch (error) {
      router.back();
      console.error('Facebook login error:', error);
    }
  };
  
  if (showEmailVerification) {
    return (
      <GlassPanel className="w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-around relative text-white">
        <div className="text-white flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">
            {isCreatingAccount ? 'Creating Your Account' : 'Verify Your Email'}
          </h3>
          <Image src="/images/actota-logo.png" alt="logo" width={110} height={20} />
        </div>
        
        {isCreatingAccount ? (
          <div className="py-8 text-center">
            <div className="mb-4">
              <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg text-white">Please wait while we create your account...</p>
            <p className="text-sm text-primary-gray mt-2">This will only take a moment</p>
          </div>
        ) : (
          <>
            <EmailVerification
              mode="signup"
              initialEmail={formData.email}
              onSuccess={handleEmailVerificationSuccess}
              onError={handleEmailVerificationError}
            />

            <button
              onClick={() => setShowEmailVerification(false)}
              className="mt-6 text-primary-gray hover:text-white transition-colors"
            >
              ← Back to signup
            </button>
          </>
        )}
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-around relative text-white">
      <div className="text-white flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Let&apos;s Get Started!</h3>
        <Image src="/images/actota-logo.png" alt="logo" width={110} height={20} />
      </div>
      <p className='text-light-gray text-[16px] leading-[24px] mt-1'>Create an account to continue.</p>

      <form onSubmit={handleSubmit} className="m-auto flex flex-col gap-4 w-full mt-[16px]">
        <div>
          <p className="text-primary-gray  text-left mb-1 mt-[16px]">Full Name</p>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Full Name"
            classname={errors.firstName ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.firstName && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.firstName}
            </div>
          )}
        </div>

        <div>
          <p className="text-primary-gray  text-left mb-1 mt-[16px]">Last Name</p>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            classname={errors.firstName ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.lastName && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.lastName}
            </div>
          )}
        </div>
        <div>
          <p className="text-primary-gray  text-left mb-1 mt-[10px]">Email Address</p>
          <div className="relative">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange(e);
                // Reset verification if email changes
                if (verifiedEmail !== e.target.value) {
                  setEmailVerified(false);
                }
              }}
              icon={<Image src="/svg-icons/mail.svg" alt="mail" width={20} height={20} />}
              placeholder="Your email address"
              classname={errors.email ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
            />
            {emailVerified && verifiedEmail === formData.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-500">Verified</span>
              </div>
            )}
          </div>
          {errors.email && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <p className="text-primary-gray  text-left mb-1 mt-[10px]">Password</p>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            icon={<Image src="/svg-icons/lock.svg" alt="lock" width={20} height={20} />}
            placeholder="Your Password"
            classname={errors.password ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.password && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.password}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="bg-white text-black w-full my-[10px]"
          disabled={isPending}
        >
          {isPending ? 'Creating Account...' : 'Create My Account'}
        </Button>
      </form>

      <div className="text-white flex justify-center items-center gap-[16px]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
        <p className='text-primary-gray text-[14px] leading-[20px] whitespace-nowrap'>or continue with</p>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
      </div>
      <div className="flex justify-center items-center gap-[8px] my-[16px] pb-[16px]">
        <button onClick={handleGoogleLogin} className='bg-[#262626] rounded-[8px] h-[56px] w-[180px] flex justify-center items-center max-sm:w-[130px] hover:cursor-pointer'>

          <Image src="/svg-icons/google.svg" alt="google" width={20} height={20} />
        </button>
        <button onClick={handleAppleLogin} className='bg-[#262626] rounded-[8px] h-[56px] w-[180px] flex justify-center items-center max-sm:w-[130px] hover:cursor-pointer'>
          <Image src="/svg-icons/apple.svg" alt="apple" width={20} height={20} />
        </button>
        <button onClick={handleFacebookLogin} className='bg-[#262626] rounded-[8px] h-[56px] w-[180px] flex justify-center items-center max-sm:w-[130px] hover:cursor-pointer'>
          <Image src="/svg-icons/facebook.svg" alt="facebook" width={20} height={20} />
        </button>
      </div>
      <p className="m-auto text-primary-gray text-[14px] leading-[20px] mb-[32px]">By creating an account, I agree to ACTOTA&apos;s <Link href="/auth/signin" className="text-white"><b><u>terms of service</u></b></Link> and <Link href="/auth/signin" className="text-white"><b><u>privacy policy.</u></b></Link></p>

      <p className="m-auto text-primary-gray text-[16px] leading-[20px]">Already have an account? <Link href="/auth/signin" className="text-white"><b><u>Log in here</u></b></Link></p>
    </GlassPanel>
  );
}

