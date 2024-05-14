import React, { useState } from 'react';
import { Range } from "react-date-range";

import Button from "../Button";
import Calendar from "../inputs/Calendar";
import LodgingDetailsCounter from '../LodgingDetailsCounter';
import { BsCaretDownFill } from "react-icons/bs";



interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [detailsCounterVisible, setDetailsCounterVisible] = useState(false);
  const [localDateRange, setLocalDateRange] = useState(dateRange); // Local state to handle date range

  const handleDateClick = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleToggleDetailsCounter = () => {
    setDetailsCounterVisible(!detailsCounterVisible);
  };

  const handleDateChange = (value: Range) => {
    setLocalDateRange(value); // Update local state with new date range
    setCalendarVisible(false); // Hide the calendar after date selection
  };

  const handleSubmit = () => {
    onChangeDate(localDateRange); // Update the dateRange in the parent component when submitting
    onSubmit();
  };

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center justify-between p-4">
        <div className="text-2xl font-semibold">${price} per person</div>
        <div>${price}</div>
      </div>
      <div onClick={handleDateClick} className="cursor-pointer">
        <div className="border-[1px] border-neutral-300 rounded-lg p-3 m-4 flex justify-between">
          <span>{dateRange.startDate?.toLocaleDateString()}</span>
          <span className="border-l-[1px] border-neutral-300 px-2">{dateRange.endDate?.toLocaleDateString()}</span>
        </div>
      </div>
      {calendarVisible && (
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={handleDateChange}
        />
      )}
      <div onClick={handleToggleDetailsCounter} className="cursor-pointer">
        <div className="border-[1px] border-neutral-300 rounded-lg p-3 m-4 flex justify-between items-center">
          Number of Guests = guestCount
          <BsCaretDownFill />  
        </div>
      </div>

      {detailsCounterVisible && (
        <LodgingDetailsCounter />
      )}
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={handleSubmit} />
      </div>
      <hr />
      <div className="p-4">
        <div className="flex flex-row justify-between pb-5">
          <div className="underline">Travel agent fee</div>
          <div>$175</div>
        </div>
        <div className="flex flex-row justify-between pb-5">
          <div className="underline">ACTOTA service fee</div>
          <div>$296</div>
        </div>
        <div className="flex flex-row justify-between text-lg font-semibold">
          <div className="underline">Total before taxes</div>
          <div>${totalPrice}</div>
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;
