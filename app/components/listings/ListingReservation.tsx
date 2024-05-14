import React, { useState } from 'react';
import { Range } from "react-date-range";

import Button from "../Button";
import Calendar from "../inputs/Calendar";
import DatePicker from '../inputs/Calendar';

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
  const [localDateRange, setLocalDateRange] = useState(dateRange); // Local state to handle date range

  const handleDateClick = () => {
    setCalendarVisible(!calendarVisible);
  };
  const handleDateChange = (ranges: RangeKeyDict) => {
    // Assuming the first key in RangeKeyDict corresponds to the needed date range.
    // Typically, you may name it, e.g., 'selection', in your DateRangePicker setup.
    const newRange = ranges[Object.keys(ranges)[0]]; // Get the first range object
    setLocalDateRange(newRange); // Update local state with new date range
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
        <div className="border-[1px] border-neutral-300 rounded-lg p-2 m-4 flex justify-between" style={{ width: 'calc(100% - 32px)' }}>
          <span>{dateRange.startDate?.toLocaleDateString()}</span>
          <span className="border-l-[1px] border-neutral-300 px-2">{dateRange.endDate?.toLocaleDateString()}</span>
        </div>
      </div>
      {calendarVisible && (
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => onChangeDate(value.selection)}
        />
      )}
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      <hr />
      <div className="p-4">
        <div className="flex flex-row justify-between">
          <div>Travel Agent Fee</div>
          <div>$175</div>
        </div>
        <div className="flex flex-row justify-between">
          <div>ACTOTA service fee</div>
          <div>$296</div>
        </div>
        <div className="flex flex-row justify-between text-lg font-semibold">
          <div>Total before taxes</div>
          <div>${totalPrice}</div>
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;

