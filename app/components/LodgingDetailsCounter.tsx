import React, { useState } from 'react';
import Counter from './inputs/Counter';
interface LodgingDetailsCounterProps {
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  setGuestCount: (value: number) => void;
  setRoomCount: (value: number) => void;
  setBathroomCount: (value: number) => void;
}

const LodgingDetailsCounter: React.FC<LodgingDetailsCounterProps> = ({
  guestCount,
  roomCount,
  bathroomCount,
  setGuestCount,
  setRoomCount,
  setBathroomCount
}) => {
  return (
    <div className="flex flex-col w-1/2 gap-2">
      <Counter 
        onChange={setGuestCount}
        value={guestCount}
        title="Guests" 
      />
      <hr />
      <Counter 
        onChange={setRoomCount}
        value={roomCount}
        title="Rooms"
      />
      <hr />
      <Counter 
        onChange={setBathroomCount}
        value={bathroomCount}
        title="Bathrooms"
      />
    </div>
  );
};

export default LodgingDetailsCounter;