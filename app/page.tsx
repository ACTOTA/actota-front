import React from 'react';
import getListings from "./actions/getListings";
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "./components/ClientOnly";
import getCurrentUser from "./actions/getCurrentUser";
import HomeListings from "./components/HomeListings";
import ListingCard from "./components/listings/ListingCard";
import Hero from "./components/Hero";
import WhyBook from "./components/WhyBook";
import SmallCards, { NearbyData } from "./components/SmallCards"; // Ensure NearbyData is exported
import MediumCards, { TravelModeData } from "./components/MediumCards";
import Filter from './components/Filter';
import Head from 'next/head';

export default async function Home() {
  const listings = await getListings() ?? [];
  const currentUser = await getCurrentUser();

  // Handle the case where no listings are available
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <Container>
          <EmptyState showReset />
        </Container>
      </ClientOnly>
    );
  }


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

        {/* <Container>
          <main className="mx-auto max-w-7xl">
            <section className="pt-6 pb-8">
              <h2 className="py-4 text-4xl font-semibold">Explore Colorado</h2>
              <SmallCards towns={NearbyData} />
            </section>

            <section>
              <h2 className="py-8 text-4xl font-semibold">Activate Your Inner Nature</h2>
              <MediumCards towns={TravelModeData} />
            </section>

          </main>
          <Filter />
        </Container> */}

        <HomeListings />
        <WhyBook />
      </ClientOnly>
    </>
  );
}

