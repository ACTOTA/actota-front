'use client';

import { useCallback, useState, useMemo, useEffect } from "react";
import { Range } from 'react-date-range';
import { formatISO } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import dynamic from 'next/dynamic';

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import TownSelect from "../inputs/TownSelect";
import ActivityBox, { ActivitySelectValue } from '../inputs/ActivityInput';
import Heading from '../Heading';
import Activities from '../Activities';
import Types from '../Types';
import { STEPS } from '../../types/steps';

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [location, setLocation] = useState();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [selectedActivities, setSelectedActivities] = useState<ActivitySelectValue[]>([]);

  useEffect(() => {
    console.log(searchModal.step);
  }, [searchModal]);

  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
  }), []);

  const onBack = useCallback(() => searchModal.onBack(), [searchModal]);
  const onNext = useCallback(() => searchModal.onNext(), [searchModal]);

  const onSubmit = useCallback(() => {
    if (searchModal.step !== STEPS.TYPE) {
      onNext();
      return;
    }

    const currentQuery = qs.parse(params?.toString() || '');
    const updatedQuery = {
      ...currentQuery,
      locationValue: (location && (location as { value: string }).value) || undefined,
      activitiesValue: selectedActivities.map(a => a.label).join(','),
      guestCount,
      roomCount,
      bathroomCount,
      startDate: dateRange.startDate ? formatISO(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? formatISO(dateRange.endDate) : undefined
    };

    const queryString = qs.stringify(updatedQuery, { skipNull: true });
    router.push(`/?${queryString}`);

    searchModal.step = STEPS.LOCATION;
    searchModal.onClose();
  }, [dateRange, guestCount, location, onNext, params, router, roomCount, searchModal, selectedActivities, bathroomCount]);

  const actionLabel = useMemo(() => searchModal.step === STEPS.TYPE ? 'Search' : 'Next', [searchModal.step]);
  const secondaryActionLabel = useMemo(() => searchModal.step === STEPS.LOCATION ? undefined : 'Back', [searchModal.step]);

  let bodyContent;
  switch (searchModal.step) {
    case STEPS.DATE:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="When do you plan to go?" subtitle="Select your dates" />
          <Calendar onChange={(range) => setDateRange(range.selection)} value={dateRange} />
        </div>
      );
      break;
    case STEPS.INFO:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="More information" subtitle="Specify details" />
          <Counter onChange={setGuestCount} value={guestCount} title="Guests" subtitle="How many guests?" />
          <Counter onChange={setRoomCount} value={roomCount} title="Rooms" subtitle="Room requirements?" />
          <Counter onChange={setBathroomCount} value={bathroomCount} title="Bathrooms" subtitle="Bathroom needs?" />
        </div>
      );
      break;
    case STEPS.ACTIVITIES:

      bodyContent = <Activities value={selectedActivities} onChange={setSelectedActivities} />;
      break;
    case STEPS.TYPE:
      bodyContent = <Types />;
      break;
    default:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Where do you wanna go?" subtitle="Choose a location" />
          <TownSelect value={location} onChange={(val) => setLocation(val)} />
          <hr />
          <Map />
        </div>
      );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filter Settings"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
}

export default SearchModal;
