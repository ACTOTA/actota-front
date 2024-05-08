'use client';

import { useMemo } from "react";
import { Reservation } from "@prisma/client";

import { SafeListing, SafeUser } from "@/app/types";
import { activities } from "@/app/components/Activities";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import ListingType from "@/app/components/listings/ListingType";
import ListingItinerary from "@/app/components/listings/ListingItinerary";
import ListingDays from "@/app/components/listings/ListingDays";

interface ListingClientProps {
  reservations?: Reservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser
}) => {
  const activity = useMemo(() => {
     return activities.find((items) => 
      items.label === listing.activity);
  }, [listing.activity]);
  
  return ( 
        <Container>
          
          <div 
            className="max-w-screen-lg mx-auto ">
            <div className="flex flex-col gap-6">
            <ListingHead
                title={listing.title}
                imageSrc={listing.imageSrc}
                locationValue={listing.locationValue}
                id={listing.id}
                currentUser={currentUser}
            />


              <div 
                className="grid grid-cols-1 mt-6 // md:grid-cols-7 md:gap-10"
              >
                <ListingInfo
                  user={listing.user}
                  activity={activity}
                  description={listing.description}
                  roomCount={listing.roomCount}
                  guestCount={listing.guestCount}
                  bathroomCount={listing.bathroomCount}
                  locationValue={listing.locationValue}
                />
                <div 
                  className="order-first mb-10 // md:order-last md:col-span-3"
                >
                   {/* <ListingReservation
                    price={listing.price}
                    totalPrice={totalPrice}
                    onChangeDate={(value) => setDateRange(value)}
                    dateRange={dateRange}
                    onSubmit={onCreateReservation}
                    disabled={isLoading}
                    disabledDates={disabledDates}
                  /> */}
                  <ListingType />

                </div>
                
              </div>

            </div>
          </div>
        </Container>
       );
    }
     
    export default ListingClient;
    

