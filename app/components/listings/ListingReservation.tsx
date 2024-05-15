import React, { useState } from 'react';
import { Range, RangeKeyDict } from 'react-date-range';

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
  const [localDateRange, setLocalDateRange] = useState<Range>(dateRange);

  const handleDateClick = () => {
    setCalendarVisible(true);
  };

  const handleToggleDetailsCounter = () => {
    setDetailsCounterVisible(!detailsCounterVisible);
  };

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setLocalDateRange(selection);

    if (selection.startDate && selection.endDate && selection.startDate !== selection.endDate) {
      setCalendarVisible(false);
      onChangeDate(selection);
    }
  };

  const handleSubmit = () => {
    onChangeDate(localDateRange);
    onSubmit();
  };

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center justify-between p-4">
        <div className="text-2xl font-semibold">${price} per person</div>
        <div>${totalPrice}</div>
      </div>
      <div onClick={handleDateClick} className="cursor-pointer">
        <div className="border-[1px] border-neutral-300 rounded-lg p-3 m-4 flex justify-between">
          <span>{localDateRange.startDate?.toLocaleDateString()}</span>
          <span className="border-l-[1px] border-neutral-300 px-2">{localDateRange.endDate?.toLocaleDateString()}</span>
        </div>
      </div>
      {calendarVisible && (
        <Calendar
          value={localDateRange}
          disabledDates={disabledDates}
          onChange={handleDateChange}
        />
      )}
      <div onClick={handleToggleDetailsCounter} className="cursor-pointer">
        <div className="border-[1px] border-neutral-300 rounded-lg p-3 m-4 flex justify-between items-center">
          Number of Guests
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
