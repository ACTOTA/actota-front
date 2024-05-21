import React, { useState } from 'react';
import Counter from './Counter';

const LodgingDetailsCounter = () => {
  // State hooks for managing counts
  const [guestCount, setGuestCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [bathroomCount, setBathroomCount] = useState(0);

  // Function to update state based on the type
const setCustomValue = (type: string, value: number) => {
    switch (type) {
        case 'guestCount':
            setGuestCount(value);
            break;
        case 'roomCount':
            setRoomCount(value);
            break;
        case 'bathroomCount':
            setBathroomCount(value);
            break;
        default:
            console.warn('Invalid type for counter');
    }
};

  return (
    <div className="flex flex-col gap-2 p-2 border rounded-md">
      <Counter 
        onChange={(value) => setCustomValue('guestCount', value)}
        value={guestCount}
        title="Guests" 
        subtitle=""
      />
      <hr />
      <Counter 
        onChange={(value) => setCustomValue('roomCount', value)}
        value={roomCount}
        title="Rooms" 
        subtitle=""
      />
      <hr />
      <Counter 
        onChange={(value) => setCustomValue('bathroomCount', value)}
        value={bathroomCount}
        title="Bathrooms" 
        subtitle=""
      />
    </div>
  );
};

export default LodgingDetailsCounter;
