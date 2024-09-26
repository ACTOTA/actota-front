import React from "react";
import getListings from "../actions/getListings";
import ListingCard from "../components/listings/ListingCard";
import getCurrentUser from "../actions/getCurrentUser";

export default async function HomeListings() {

  const listings = await getListings() ?? [];
  const currentUser = await getCurrentUser();

  return (
    <section className="h-[100vh] px-8 py-4">
      <div>
        Popular
      </div>
      <div className="grid grid-cols-4 gap-4">
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
