'use client';
import React from 'react';
import FeaturedItineraries from "./FeaturedItineraries";
import WhyBook from "./WhyBook";
import FAQs from './FAQs';
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import { useActivities } from '@/src/hooks/queries/activity/useActivityQuery';
const Landing = () => {
    const { data: activities, isLoading, error } = useActivities();
    console.log(activities);
  return (
    <>
      <FeaturedItineraries />
      <WhyBook />
      <FAQs />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Landing; 