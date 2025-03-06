import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ActivitySelectValue {
  label: string;
  duration: number;
}

interface ActivitiesContextType {
  activities: ActivitySelectValue[];
  updateActivities: (newActivities: ActivitySelectValue[]) => void;
  totalDuration: number;
}

// Create the base context
const ActivitiesContext = createContext<ActivitiesContextType>({
  activities: [],
  updateActivities: () => { },
  totalDuration: 0,
});

interface ActivitiesProviderProps {
  children: ReactNode;
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

// Updated hook that returns data in a query-like format
export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // If no context found, throw an error
  if (!context) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }

  return {
    data: context.activities,
    isLoading,
    error,
    updateActivities: context.updateActivities,
    totalDuration: context.totalDuration
  };
};
