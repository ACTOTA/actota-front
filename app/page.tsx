import React from 'react';
import ClientOnly from "./components/ClientOnly";
import Hero from "./components/Hero";
import WhyBook from "./components/WhyBook";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Head from 'next/head';
import FeaturedItineraries from './components/FeaturedItineraries';

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
      <ClientOnly>
        <Hero />
        <FeaturedItineraries />
        <WhyBook />
        <Newsletter />
        <Footer />
      </ClientOnly>
    </>
  );
}

