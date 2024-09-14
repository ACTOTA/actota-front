import React from "react";
import getListings from "../actions/getListings";
import ListingCard from "../components/listings/ListingCard";
import getCurrentUser from "../actions/getCurrentUser";

export default async function HomeListings() {

  const listings = await getListings() ?? [];
  const currentUser = await getCurrentUser();

  return (
    <section className="h-[100vh]">
      <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </section>
  )
}
