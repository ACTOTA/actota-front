import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ActivitySelectValue {
  label: string;
  duration: number;
}

interface ActivitiesContextType {
  activities: ActivitySelectValue[];
  updateActivities: (newActivities: ActivitySelectValue[]) => void;
  totalDuration: number;
}

const ActivitiesContext = createContext<ActivitiesContextType>({
  activities: [],
  updateActivities: () => {},
  totalDuration: 0,
});

interface ActivitiesProviderProps {
  children: ReactNode; // This is the line that defines what `children` should be
}

export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<ActivitySelectValue[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);

  const updateActivities = (newActivities: ActivitySelectValue[]) => {
    setActivities(newActivities);
    setTotalDuration(newActivities.reduce((acc, curr) => acc + curr.duration, 0));
  };

  return (
    <ActivitiesContext.Provider value={{ activities, updateActivities, totalDuration }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => useContext(ActivitiesContext);
