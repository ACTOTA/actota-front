import React from 'react';
import getListings from "./actions/getListings";
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "./components/ClientOnly";
import getCurrentUser from "./actions/getCurrentUser";
import ListingCard from "./components/listings/ListingCard";
import Banner from "./components/Banner";
import SmallCards, { NearbyData } from "./components/SmallCards"; // Ensure NearbyData is exported
import Filter from './components/Filter';

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
    <ClientOnly>
      <Banner />
      <Container>
        <main className="mx-auto max-w-7xl">
          <section className="pt-6 pb-8">
            <h2 className="py-4 text-4xl font-semibold">Explore Colorado</h2>
            <SmallCards towns={NearbyData} />
          </section>
          <section>
          
            <h2 className="py-8 text-4xl font-semibold">Featured Listings</h2>
            
          </section>
          
        </main>
        <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {listings.map((listing) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}

