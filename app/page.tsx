
import getListings from "./actions/getListings";
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "./components/ClientOnly";
import getCurrentUser from "./actions/getCurrentUser";
import ListingCard from "./components/listings/ListingCard";
import Filter from "./components/Filter";
import Banner from "./components/Banner";


export default async function Home() {
  const listings: any[] = await getListings() ?? [];
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <Container>
          <EmptyState showReset/>
        </Container>
      </ClientOnly>
    )
  } 

  return (
    <ClientOnly>
      <Container>
        <div 
          className="grid grid-cols-1 gap-8 pt-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        >
          {listings.map((listing) => {
            return (
              <ListingCard 
                currentUser={currentUser} 
                key={listing.id} 
                data={listing} 
              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )  
}

