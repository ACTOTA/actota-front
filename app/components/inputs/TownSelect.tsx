// TownSelect.js

import React from 'react';
import Select from 'react-select';
import useTowns from '@/app/hooks/useTowns';

export type TownSelectValue = {
  flag: string;
  label: string;
  latlng: number[],
  region: string;
  value: string
}

interface TownSelectProps {
  value?: TownSelectValue;
  onChange: (value: TownSelectValue | null) => void;
}

const TownSelect: React.FC<TownSelectProps> = ({ value, onChange }) => {
  const { getAll } = useTowns();

  return (
    <Select
      placeholder="Select a town in Colorado"
      isClearable
      options={getAll()}
      value={value}
      onChange={onChange}  // This calls the passed in onChange function from the parent component
      formatOptionLabel={(option: TownSelectValue) => (
        <div className="flex flex-row items-center gap-3">
          <div>{option.flag}</div>
          <div>{option.label}, <span className="text-neutral-500 ml-1">{option.region}</span></div>
        </div>
      )}
      classNamePrefix='select'
      theme={(theme) => ({
        ...theme,
        borderRadius: 6,
        colors: {
          ...theme.colors,
          primary: 'black',
          primary25: '#ffe4e6'
        }
      })}
    />
  );
}

export default TownSelect;
