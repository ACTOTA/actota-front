import React from 'react';
import ClientOnly from "@/src/components/ClientOnly";
import Hero from "@/src/components/Hero";
import WhyBook from "@/src/components/WhyBook";
import Newsletter from "@/src/components/Newsletter";
import Footer from "@/src/components/Footer";
import Head from 'next/head';
import FeaturedItineraries from "@/src/components/FeaturedItineraries";
import FAQs from '@/src/components/FAQs';

export default async function Home() {


  // Since NearbyData is now properly imported, use it directly
  return (
    <>
      <Head>
        <title>ACTOTA</title>
        <meta name="ACTOTA" content="Personalized Tours Made Easy" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap" rel="stylesheet" />
      </Head>
      <Hero />

      <ClientOnly>
        <FeaturedItineraries />
        <WhyBook />
        <FAQs />
        <Newsletter />
        <Footer />
      </ClientOnly>
    </>
  );
}

