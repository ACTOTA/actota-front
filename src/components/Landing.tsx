'use client';
import React from 'react';
import FeaturedItineraries from "./FeaturedItineraries";
import WhyBook from "./WhyBook";
import FAQs from './FAQs';
import Newsletter from "./Newsletter";
import Footer from "./Footer";

const Landing = () => {
 
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
