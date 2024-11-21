import React from "react";
import ListingCard from "../components/listings/ListingCard";

export default async function HomeListings() {
  const listings = [];

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
