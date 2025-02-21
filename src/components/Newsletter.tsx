import React, { useState } from 'react';

import { CiMail } from "react-icons/ci";
import Image from 'next/image';
import Button from './figma/Button';
import Input from './figma/Input';
import { useNewsLetterSubscribe, useNewsLetterUnsubscribe } from '@/src/hooks/mutations/newsLetter.mutation';
import { toast } from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { mutate: subscribe, isPending } = useNewsLetterSubscribe();
  const { mutate: unsubscribe, isPending: isUnsubscribing } = useNewsLetterUnsubscribe();

  const newsletter = localStorage.getItem('newsletter');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (newsletter) {
      unsubscribe(newsletter, {
        onSuccess: (data) => {
          toast.success('Successfully unsubscribed from newsletter!');
          localStorage.removeItem('newsletter');
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Failed to unsubscribe');
        }
      });
    }
    subscribe(email, {
      onSuccess: (data) => {
        toast.success('Successfully subscribed to newsletter!');
        setEmail(''); // Clear the input
        localStorage.setItem('newsletter', email);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to subscribe');
      }
    });
  };

  return (
    <section className='flex justify-center my-10 max-sm:mt-16 max-w-[1440px] max-sm:mx-4 max-lg:mx-8 max-2xl:mx-[80px] 2xl:mx-auto '>
      <div className="p-4 sm:p-12 bg-[#012a6a] rounded-2xl w-full justify-between  items-center max-xl:flex-col-reverse gap-16 inline-flex m-auto">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 sm:gap-12  inline-flex">
          <div className="flex-col justify-center items-start gap-4 flex">
            <h1 className="self-stretch text-white text-3xl sm:text-[56px] font-bold  sm:leading-[72px]">Subscribe to<br />Our Newsletter</h1>
            <p className="self-stretch text-white text-base font-normal  leading-normal">Stay updated with the latest news, insights, and exclusive offers delivered directly to your inbox!</p>
          </div>
          <form onSubmit={handleSubmit} className="self-stretch justify-start items-start gap-2 inline-flex flex-wrap">

            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Your Email"
              classname='flex-1 max-w-[400px] py-0.5 !rounded-full max-sm:max-w-full'
              icon={<CiMail className="text-white h-6 w-6" />}
            />
            {newsletter ? (
              <Button
                type="submit"
                variant="primary"
                className="bg-white text-black max-sm:w-full"
                disabled={isPending}
              >
                {isPending ? 'Unsubscribing...' : 'Unsubscribe'}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="bg-white text-black max-sm:w-full"
                disabled={isPending}
              >
                {isPending ? 'Subscribing...' : 'Subscribe'}
              </Button>
            )}
          </form>
        </div>
        <div className="h-[300px] min-w-[360px] z-10 relative max-sm:mt-[-50px]">
          <Image src="/images/newsletter.png" alt="newsletter" layout="fill" objectFit="contain" />
        </div>
      </div>

    </section>
  )
}
