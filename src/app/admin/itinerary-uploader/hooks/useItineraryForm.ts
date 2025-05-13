'use client';

import { useState, useEffect } from 'react';
import { 
  FeaturedVacation, 
  FormErrors, 
  Activity, 
  DayItem, 
  ActiveSearchItem,
  Message
} from '../types';
import { 
  extractObjectId, 
  extractCompanyName, 
  parseCoordinates, 
  DENVER_COORDINATES,
  getCityCoordinates,
  sortDayNumbers
} from '../utils';
import { getErrorMessage } from '@/src/utils/getErrorMessage';

// Initial form state with default values
const initialFormData: FeaturedVacation = {
  trip_name: '',
  fareharbor_id: undefined,
  min_age: undefined,
  min_group: 1,
  max_group: 10,
  length_days: 1,
  length_hours: 8,
  start_location: {
    city: 'Denver',
    state: 'Colorado',
    coordinates: DENVER_COORDINATES
  },
  end_location: {
    city: 'Denver',
    state: 'Colorado',
    coordinates: DENVER_COORDINATES
  },
  description: '',
  days: { "1": [] },
  images: []
};

// Initial errors state
const initialErrors: FormErrors = {
  trip_name: '',
  min_group: '',
  max_group: '',
  length_days: '',
  length_hours: '',
  start_location: '',
  end_location: '',
  description: '',
  days: '',
  images: ''
};

export function useItineraryForm() {
  // Form state
  const [formData, setFormData] = useState<FeaturedVacation>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [newImage, setNewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [renumberNotification, setRenumberNotification] = useState<string | null>(null);

  // Activity search state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activeSearchItem, setActiveSearchItem] = useState<ActiveSearchItem | null>(null);

  // Filter activities based on search query
  useEffect(() => {
    // Make sure activities is an array before filtering
    if (!Array.isArray(activities)) {
      setFilteredActivities([]);
      return;
    }

    if (activitySearchQuery.trim() === '') {
      setFilteredActivities(activities);
    } else {
      const query = activitySearchQuery.toLowerCase();
      const filtered = activities.filter(activity =>
        (activity && activity.title && activity.title.toLowerCase().includes(query)) ||
        (activity && activity.description && activity.description.toLowerCase().includes(query)) ||
        (activity && activity.location && activity.location.toLowerCase().includes(query))
      );
      setFilteredActivities(filtered);
    }
  }, [activitySearchQuery, activities]);

  // Calculate trip duration on component mount and when days/items change
  useEffect(() => {
    calculateTripDuration();
    fetchActivities();
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If clicking outside and a dropdown is active, close it
      if (activeSearchItem && !(e.target as Element).closest('.activity-search-container')) {
        setActiveSearchItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSearchItem]);

  // When activeSearchItem changes, log to verify behavior
  useEffect(() => {
    if (activeSearchItem) {
      console.log(`Search active for day ${activeSearchItem.dayNumber}${activeSearchItem.itemIndex === -1 ? ' (day level)' : ` item ${activeSearchItem.itemIndex}`}`);
    }
  }, [activeSearchItem]);

  // Fetch activities from the API
  const fetchActivities = async () => {
    setIsLoadingActivities(true);
    try {
      const response = await fetch('http://localhost:8080/api/activities');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure we always have an array, even if API returns null or undefined
      const activitiesArray = Array.isArray(data.activities) ? data.activities : [];
      setActivities(activitiesArray);
      // Also update filtered activities
      setFilteredActivities(activitiesArray);
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Reset to empty arrays on error
      setActivities([]);
      setFilteredActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Generic handler for simple field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (['min_group', 'max_group', 'length_days', 'length_hours', 'fareharbor_id', 'min_age'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? (name === 'fareharbor_id' || name === 'min_age' ? undefined : 0) : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handler for location changes with auto coordinate population
  const handleLocationChange = (locationKey: 'start_location' | 'end_location', field: keyof typeof formData.start_location, value: string) => {
    setFormData(prev => {
      const updatedLocation = { ...prev[locationKey] };

      // Update the field with the new value
      if (field === 'coordinates') {
        updatedLocation.coordinates = parseCoordinates(value);
      } else {
        updatedLocation[field] = value;

        // Auto-populate coordinates based on city/state
        if (field === 'city' || field === 'state') {
          const cityCoords = getCityCoordinates(
            updatedLocation.city, 
            updatedLocation.state
          );
          
          if (cityCoords) {
            updatedLocation.coordinates = cityCoords;
          }
        }
      }

      return {
        ...prev,
        [locationKey]: updatedLocation
      };
    });
  };

  // Handle selecting an activity from the dropdown
  const handleSelectActivity = (activity: Activity, dayNumber: string, itemIndex: number) => {
    // Debug log to see what data we're getting
    console.log('Selected activity data:', {
      activity,
      price: activity.price_per_person,
      durationMinutes: activity.duration_minutes,
      company: activity.company,
      location: activity.address?.city
    });

    // Extract the ObjectId string value
    const activityId = extractObjectId(activity._id);

    // Create an update batch for all the activity properties
    const updates: Record<string, string> = {
      'activity_id': activityId
    };

    // Add additional activity details if available
    if (activity.title) {
      updates['activity_title'] = activity.title;
    }

    if (activity.description) {
      updates['activity_description'] = activity.description;
    }

    // Use price_per_person from the updated struct
    if (activity.price_per_person !== undefined) {
      updates['activity_price'] = activity.price_per_person.toString();
    }

    // Company name is now directly in the company field
    if (activity.company) {
      updates['activity_company'] = activity.company;
    }

    // Handle location from address if available
    if (activity.address?.city) {
      const locationParts = [];
      if (activity.address.city) locationParts.push(activity.address.city);
      if (activity.address.state) locationParts.push(activity.address.state);
      updates['activity_location'] = locationParts.join(', ');
    }

    // Convert duration_minutes to hours with one decimal place
    if (activity.duration_minutes !== undefined) {
      const hoursDecimal = (activity.duration_minutes / 60).toFixed(1);
      updates['activity_duration'] = hoursDecimal;
    } else {
      // Provide a default duration of 2 hours if API doesn't have one
      updates['activity_duration'] = '2';
      console.log('Using default duration of 2 hours since none provided by API');
    }

    // Store the available time slots if they exist
    if (activity.daily_time_slots && Array.isArray(activity.daily_time_slots) && activity.daily_time_slots.length > 0) {
      try {
        // For debugging, log time slots
        console.log('Time slots found:', activity.daily_time_slots);
        console.log('Sample time slot format:', activity.daily_time_slots[0]);

        // Store as a serialized JSON string, we'll parse it back when needed
        updates['activity_time_slots'] = JSON.stringify(activity.daily_time_slots);

        // If there's at least one time slot, set the default time to the first available slot
        const availableSlots = activity.daily_time_slots
          .filter(slot =>
            // Keep only valid slots with a start time (either format)
            slot &&
            typeof slot === 'object' &&
            (
              // Check both possible formats of start time
              (slot.start && typeof slot.start === 'string') ||
              (slot.start_time && typeof slot.start_time === 'string')
            ) &&
            slot.available !== false // Include slots that are available or where available is not specified
          )
          .map(slot => {
            // Get the start time from either format (start or start_time)
            const startTime = slot.start || slot.start_time;

            // If the time includes seconds (HH:MM:SS), trim to HH:MM format
            return startTime?.includes(':')
              ? startTime.split(':').slice(0, 2).join(':')
              : startTime;
          });

        if (availableSlots.length > 0) {
          // Initialize with the first available time if we have any
          updates['available_time_slots'] = JSON.stringify(availableSlots);

          // Set the initial time to the first available slot
          handleDayItemChange(dayNumber, itemIndex, 'time', availableSlots[0]);
        } else {
          console.warn('No valid time slots found in activity.daily_time_slots');
        }
      } catch (error) {
        console.error('Error processing time slots:', error);
      }
    }

    // Apply all updates at once
    setFormData(prev => {
      const dayItems = [...prev.days[dayNumber]];
      const item = { ...dayItems[itemIndex] } as any;

      // Apply all updates to the item
      Object.keys(updates).forEach(key => {
        item[key] = updates[key];
      });

      dayItems[itemIndex] = item;

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNumber]: dayItems
        }
      };
    });

    // Reset search state
    setSelectedActivity(null);
    setActivitySearchQuery('');
    setActiveSearchItem(null);

    // Force recalculate duration to account for the new activity duration
    setTimeout(calculateTripDuration, 0);
  };

  // Add new image to the images array
  const handleAddImage = () => {
    if (newImage.trim() && formData.images) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()]
      }));
      setNewImage('');
    }
  };

  // Remove image at specific index
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  // Add a new day
  const handleAddDay = () => {
    // Get all days sorted by number
    const sortedDayNumbers = Object.keys(formData.days)
      .map(d => parseInt(d))
      .sort((a, b) => a - b);
    
    // The next day number should be the length + 1 (equivalent to the last day number + 1)
    const nextDayNumber = sortedDayNumbers.length > 0 ? sortedDayNumbers.length + 1 : 1;

    setFormData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [nextDayNumber.toString()]: []
      }
    }));

    // Recalculate duration after adding a day
    setTimeout(calculateTripDuration, 0);
  };

  // Remove a day and reorder day numbers
  const handleRemoveDay = (dayNumber: string) => {
    // Convert to number for comparison
    const dayToRemove = parseInt(dayNumber);
    
    // Get all days sorted by number
    const sortedDayNumbers = Object.keys(formData.days)
      .map(d => parseInt(d))
      .sort((a, b) => a - b);
    
    // Create new days object
    const newDays: { [key: string]: DayItem[] } = {};
    
    // Repopulate with correct numbering
    let newIndex = 1;
    sortedDayNumbers.forEach(day => {
      // Skip the day we're removing
      if (day !== dayToRemove) {
        // Store this day's items at the new index
        newDays[newIndex.toString()] = formData.days[day.toString()];
        newIndex++;
      }
    });

    // If all days are removed, add an empty day 1
    const updatedDays = Object.keys(newDays).length === 0 ? { "1": [] } : newDays;

    setFormData(prev => ({
      ...prev,
      days: updatedDays
    }));

    // Recalculate duration after removing a day
    setTimeout(calculateTripDuration, 0);
    
    // Show notification about day renumbering
    if (dayToRemove < sortedDayNumbers.length) {
      setRenumberNotification(`Day ${dayNumber} removed. Days have been renumbered.`);
      // Auto-hide notification after 3 seconds
      setTimeout(() => setRenumberNotification(null), 3000);
    }
  };

  // Add item to a day
  const handleAddDayItem = (dayNumber: string, type: 'transportation' | 'activity' | 'accommodation') => {
    console.log(`Adding ${type} item to day ${dayNumber}`);

    // Ensure default times are set for each type of item
    const defaultTimes = {
      transportation: '09:00',
      activity: '10:00',
      accommodation: '18:00'
    };

    const newItem: DayItem = type === 'transportation'
      ? {
          type: 'transportation',
          time: defaultTimes.transportation,
          name: '',
          location: { name: '', coordinates: [0, 0] }
        }
      : type === 'activity'
      ? {
          type: 'activity',
          time: defaultTimes.activity,
          activity_id: ''
        }
      : {
          type: 'accommodation',
          time: defaultTimes.accommodation,
          accommodation_id: ''
        };

    // Use a Promise to ensure state is updated before recalculating
    return new Promise<void>(resolve => {
      setFormData(prev => {
        const updatedState = {
          ...prev,
          days: {
            ...prev.days,
            [dayNumber]: [...prev.days[dayNumber], newItem]
          }
        };

        // Resolve after state update is queued
        setTimeout(resolve, 0);
        return updatedState;
      });
    }).then(() => {
      // Recalculate duration after state is updated
      console.log('Recalculating trip duration after adding new item');

      // Calculate the duration
      calculateTripDuration();

      // Second calculation after a brief delay to handle any race conditions
      setTimeout(() => {
        calculateTripDuration();
      }, 50);
    });
  };

  // Remove item from a day
  const handleRemoveDayItem = (dayNumber: string, itemIndex: number) => {
    console.log(`Removing item ${itemIndex} from day ${dayNumber}`);

    // Use a Promise to ensure state is updated before recalculating
    return new Promise<void>(resolve => {
      setFormData(prev => {
        const updatedState = {
          ...prev,
          days: {
            ...prev.days,
            [dayNumber]: prev.days[dayNumber].filter((_, idx) => idx !== itemIndex)
          }
        };

        // Resolve after state update is queued
        setTimeout(resolve, 0);
        return updatedState;
      });
    }).then(() => {
      // Recalculate duration after state is updated
      console.log('Recalculating trip duration after removing item');

      // Calculate the duration
      calculateTripDuration();

      // Second calculation after a brief delay to handle any race conditions
      setTimeout(() => {
        calculateTripDuration();
      }, 50);
    });
  };

  // Update day item fields
  const handleDayItemChange = (dayNumber: string, itemIndex: number, field: string, value: string) => {
    setFormData(prev => {
      const dayItems = [...prev.days[dayNumber]];
      const item = { ...dayItems[itemIndex] } as any;

      if (field.includes('.')) {
        // Handle nested fields like location.name
        const [parent, child] = field.split('.');
        item[parent] = {
          ...item[parent],
          [child]: child === 'coordinates' ? parseCoordinates(value) : value
        };
      } else {
        item[field] = value;
      }

      dayItems[itemIndex] = item;

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayNumber]: dayItems
        }
      };
    });

    // If changing the time, recalculate duration
    if (field === 'time') {
      setTimeout(calculateTripDuration, 0);
    }
  };

  // Auto-calculate trip duration based on days and day items
  const calculateTripDuration = () => {

    // Get current days from form data to calculate from latest state
    const currentDays = formData.days;

    // Number of days is simply the count of day keys
    const numDays = Object.keys(currentDays).length;

    // Total hours calculation
    let totalHours = 0;

    // Store per-day durations for display (will be visible in the UI)
    const dayDurations: Record<string, number> = {};

    // Process each day separately
    Object.entries(currentDays).forEach(([dayNumber, dayItems]) => {
      // METHOD 1: Sum up all activity durations for this day
      let activityDurationHours = 0;
      let activityCount = 0;

      dayItems.forEach(item => {
        if (item.type === 'activity' && (item as any).activity_duration) {
          // Parse the duration and add it to our total
          const duration = parseFloat((item as any).activity_duration);
          if (!isNaN(duration)) {
            activityDurationHours += duration;
            activityCount++;
          }
        }
      });

      // METHOD 2: Calculate based on time span from earliest to latest
      // Convert times to minutes since midnight for easier calculation
      const timesInMinutes = dayItems
        .filter(item => item.time && typeof item.time === 'string') // Filter out items with missing time
        .map(item => {
          const [hours, minutes] = item.time.split(':').map(Number);
          return hours * 60 + minutes;
        });

      // Skip time range calculation if there are no valid times
      let timeRangeDuration = 0;
      if (timesInMinutes.length >= 2) {
        const earliestTime = Math.min(...timesInMinutes);
        const latestTime = Math.max(...timesInMinutes);

        // Calculate time range in hours (rounded up)
        timeRangeDuration = Math.ceil((latestTime - earliestTime) / 60);
      }

      // DETERMINE FINAL DAY DURATION:
      // Priority: Activity sum > Time range > 0
      let dayDuration = 0;

      if (activityCount > 0) {
        // We have activities with durations, use their total
        dayDuration = activityDurationHours;
      } else if (timeRangeDuration > 0) {
        // No activity durations, but we have a time range
        dayDuration = timeRangeDuration;
      }
      // No default value - if no activities or time range, duration is 0

      // Store the day's duration for display
      dayDurations[dayNumber] = dayDuration;

      // Add this day's duration to the total
      totalHours += dayDuration;
    });


    // Update the form data with calculated duration
    setFormData(prev => ({
      ...prev,
      length_days: numDays,
      length_hours: totalHours,
      day_durations: dayDurations // Store per-day durations for UI display
    }));
  };

  const validateForm = () => {
    // Auto-calculate trip duration before validation
    calculateTripDuration();

    console.log('Validating form data...');
    let tempErrors = { ...initialErrors };
    let isValid = true;
    let validationIssues = [];

    if (!formData.trip_name) {
      tempErrors.trip_name = 'Trip name is required';
      isValid = false;
      validationIssues.push('Missing trip name');
    }

    if (formData.min_group <= 0) {
      tempErrors.min_group = 'Minimum group size must be greater than 0';
      isValid = false;
      validationIssues.push(`Invalid min_group: ${formData.min_group}`);
    }

    if (formData.max_group <= 0) {
      tempErrors.max_group = 'Maximum group size must be greater than 0';
      isValid = false;
      validationIssues.push(`Invalid max_group: ${formData.max_group}`);
    }

    if (formData.min_group > formData.max_group) {
      tempErrors.min_group = 'Minimum group size cannot be greater than maximum';
      isValid = false;
      validationIssues.push(`min_group (${formData.min_group}) > max_group (${formData.max_group})`);
    }

    // Check if length_days and length_hours look reasonable
    if (formData.length_days <= 0) {
      tempErrors.length_days = 'Trip must have at least one day';
      isValid = false;
      validationIssues.push(`Invalid length_days: ${formData.length_days}`);
    }

    if (formData.length_hours < 0) {
      tempErrors.length_hours = 'Trip cannot have negative hours';
      isValid = false;
      validationIssues.push(`Invalid length_hours: ${formData.length_hours}`);
    }

    if (!formData.start_location.city || !formData.start_location.state) {
      tempErrors.start_location = 'Start location city and state are required';
      isValid = false;
      validationIssues.push(`Missing start location details: ${JSON.stringify(formData.start_location)}`);
    }

    if (!formData.end_location.city || !formData.end_location.state) {
      tempErrors.end_location = 'End location city and state are required';
      isValid = false;
      validationIssues.push(`Missing end location details: ${JSON.stringify(formData.end_location)}`);
    }

    if (!formData.description) {
      tempErrors.description = 'Description is required';
      isValid = false;
      validationIssues.push('Missing description');
    }

    // Verify at least one day has at least one item
    let hasItems = false;
    let dayIssues = [];

    Object.entries(formData.days).forEach(([dayNumber, dayItems]) => {
      if (dayItems.length > 0) {
        hasItems = true;

        // Check for potential issues with day items
        dayItems.forEach((item, index) => {
          if (item.type === 'activity' && !(item as any).activity_id) {
            dayIssues.push(`Day ${dayNumber}, Activity ${index}: missing activity_id`);
          }
          if (item.type === 'transportation' && !(item as any).name) {
            dayIssues.push(`Day ${dayNumber}, Transportation ${index}: missing name`);
          }
        });
      }
    });

    if (!hasItems) {
      tempErrors.days = 'At least one day must have one item';
      isValid = false;
      validationIssues.push('No day items found in any day');
    }

    if (dayIssues.length > 0) {
      console.warn('Potential day items issues (not blocking submission):', dayIssues);
    }

    setErrors(tempErrors);

    if (!isValid) {
      console.error('Form validation failed:', validationIssues);
    } else {
      console.log('Form validation successful');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Prepare the data in the format expected by the backend
    const payload = {
      ...formData,
      // Convert days object to the format expected by Rust
      days: { days: formData.days }
    };

    // Perform sanity checks on the payload
    const sanitizedPayload = JSON.parse(JSON.stringify(payload));

    // Make sure day_durations is included (as it's a newer field)
    if (!sanitizedPayload.day_durations) {
      console.warn('day_durations missing in payload, adding empty object');
      sanitizedPayload.day_durations = {};

      // Re-populate from the current formData.days
      Object.entries(formData.days).forEach(([dayNumber, dayItems]) => {
        // Sum up activity durations for each day
        let dayTotal = 0;
        dayItems.forEach(item => {
          if (item.type === 'activity' && (item as any).activity_duration) {
            const duration = parseFloat((item as any).activity_duration);
            if (!isNaN(duration)) {
              dayTotal += duration;
            }
          }
        });

        sanitizedPayload.day_durations[dayNumber] = dayTotal > 0 ? dayTotal : 0;
      });
    }

    // Use the sanitized payload for submission
    const finalPayload = sanitizedPayload;

    // Add detailed logging for debugging
    console.log('Submitting form data with payload:', JSON.stringify(finalPayload, null, 2));

    // Get authentication token from cookies
    let authToken = '';
    if (typeof document !== 'undefined') {
      // Client-side: Get token from cookie
      authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1] || '';
    }

    if (!authToken) {
      setMessage({
        type: 'error',
        text: 'Authentication token missing. Please log in again.'
      });
      console.error('Cannot submit form: No authentication token found');
      setIsLoading(false);
      return;
    }

    console.log('Using authentication token:', authToken ? `${authToken.substring(0, 10)}...` : 'None');

    try {
      const response = await fetch('http://localhost:8080/api/itineraries/featured/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(finalPayload),
      });

      // Log the response details regardless of success/failure
      console.log('Server response status:', response.status);

      // Get the response text for debugging (works even for non-JSON responses)
      const responseText = await response.text();
      console.log('Server response text:', responseText);

      // If response wasn't ok, throw an error with the details
      if (!response.ok) {
        let errorDetails = responseText;

        // Try to parse as JSON if possible for better error details
        try {
          const errorJson = JSON.parse(responseText);
          if (errorJson.error || errorJson.message) {
            errorDetails = errorJson.error || errorJson.message;
          }
        } catch (parseError) {
          // If parsing fails, just use the original response text
          console.log('Could not parse error response as JSON');
        }

        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
      }

      // Try parsing the successful response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.warn('Server sent a non-JSON success response:', responseText);
        data = { message: 'Operation successful, but server did not return valid JSON' };
      }

      setMessage({ type: 'success', text: 'Featured itinerary added successfully!' });

      // Reset form
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error uploading itinerary:', error);

      // Enhanced error message with more details
      const errorMessage = getErrorMessage(error);
      setMessage({
        type: 'error',
        text: `Failed to add itinerary: ${errorMessage}. Check console for details.`
      });

      // Log the full form data (excluding sensitive fields) for debugging
      console.log('Form data that failed submission:', {
        ...finalPayload,
        // Don't log full details of days to avoid cluttering the console
        days: `[${Object.keys(formData.days).length} days with ${
          Object.values(formData.days).reduce((sum, items) => sum + items.length, 0)
        } total items]`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    newImage,
    isLoading,
    message,
    renumberNotification,
    activities,
    isLoadingActivities,
    activitySearchQuery,
    filteredActivities,
    activeSearchItem,
    setNewImage,
    setFormData,
    setActivitySearchQuery,
    setActiveSearchItem,
    handleChange,
    handleLocationChange,
    handleSelectActivity,
    handleAddImage,
    handleRemoveImage,
    handleAddDay,
    handleRemoveDay,
    handleAddDayItem,
    handleRemoveDayItem,
    handleDayItemChange,
    calculateTripDuration,
    validateForm,
    handleSubmit,
    fetchActivities
  };
}