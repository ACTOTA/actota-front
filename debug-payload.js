// Direct implementation for debugging
const formatPayloadForBackend = (formData) => {
  const now = new Date();
  const isoString = now.toISOString(); // Format: "2025-05-17T22:16:30.000Z"
  
  const result = {
    trip_name: formData.trip_name,
    fareharbor_id: formData.fareharbor_id || undefined,
    min_age: formData.min_age ? Number(formData.min_age) : undefined,
    min_group: Number(formData.min_group),
    max_group: Number(formData.max_group),
    length_days: Number(formData.length_days),
    length_hours: Number(formData.length_hours),
    start_location: {
      city: formData.start_location.city,
      state: formData.start_location.state,
      coordinates: formData.start_location.coordinates.map(coord => Number(coord))
    },
    end_location: {
      city: formData.end_location.city,
      state: formData.end_location.state,
      coordinates: formData.end_location.coordinates.map(coord => Number(coord))
    },
    description: formData.description,
    days: {},
    images: formData.images || [],
    created_at: isoString,
    updated_at: isoString
  };
  
  // Format days
  for (const [dayNum, dayItems] of Object.entries(formData.days)) {
    const formattedItems = (dayItems).map((item) => {
      // Ensure time has seconds
      let timeWithSeconds = item.time;
      if (timeWithSeconds.split(':').length === 2) {
        timeWithSeconds += ':00';
      }
      
      const formattedItem = {
        time: timeWithSeconds,
        type: item.type
      };
      
      if (item.type === 'activity' && item.activity_id) {
        formattedItem.activity_id = item.activity_id;
      } else if (item.type === 'transportation') {
        formattedItem.name = item.name;
        formattedItem.location = {
          name: item.location.name,
          coordinates: item.location.coordinates.map(coord => Number(coord))
        };
      } else if (item.type === 'accommodation' && item.accommodation_id) {
        formattedItem.accommodation_id = item.accommodation_id;
      }
      
      return formattedItem;
    });
    
    result.days[dayNum] = formattedItems;
  }
  
  // Remove any undefined fields
  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  
  return result;
};

// Sample data with minimal fields
const testData = {
  trip_name: "Test Trip",
  min_group: 1,
  max_group: 10,
  length_days: 1,
  length_hours: 8,
  start_location: {
    city: "Denver",
    state: "Colorado",
    coordinates: [39.7392, -104.9903]
  },
  end_location: {
    city: "Denver",
    state: "Colorado",
    coordinates: [39.7392, -104.9903]
  },
  description: "Test description",
  days: {
    "1": [
      {
        time: "09:00",
        type: "activity",
        activity_id: "680e9f193217b9ad0f27cee8"
      }
    ]
  },
  images: []
};

// Run the formatter
const formatted = formatPayloadForBackend(testData);
const jsonString = JSON.stringify(formatted);

console.log('Formatted data:');
console.log(JSON.stringify(formatted, null, 2));
console.log('\nJSON string length:', jsonString.length);

// Find what's at position 523
if (jsonString.length >= 523) {
  console.log('\nString too short to reach position 523');
  console.log('Actual length:', jsonString.length);
} else {
  console.log('\nJSON is only', jsonString.length, 'characters long');
}

// Look at the position in a larger example
const largerData = {
  ...testData,
  title: "Colorado's Grand Adventure",
  description: "Experience the best of Colorado with this comprehensive outdoor adventure tour. From the bustling streets of Denver to the majestic peaks of the Rocky Mountains, this tour offers an unforgettable journey through the Centennial State's most iconic destinations. Perfect for adventure seekers and nature lovers alike.",
  images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  days: {
    "1": [
      {
        time: "08:00",
        type: "transportation",
        name: "Airport Pickup",
        location: {
          name: "Denver International Airport",
          coordinates: [39.8494, -104.6730]
        }
      },
      {
        time: "10:00",
        type: "activity",
        activity_id: "680e9f193217b9ad0f27cee8",
        activity_title: "Denver City Tour",
        activity_duration: "3"
      },
      {
        time: "14:00",
        type: "activity",
        activity_id: "680e9f193217b9ad0f27cee9",
        activity_title: "Red Rocks Visit",
        activity_duration: "2"
      },
      {
        time: "18:00",
        type: "accommodation",
        accommodation_id: "680e9f193217b9ad0f27ceeb"
      }
    ],
    "2": [
      {
        time: "09:00",
        type: "activity",
        activity_id: "680e9f193217b9ad0f27ceec"
      }
    ]
  }
};

const largerFormatted = formatPayloadForBackend(largerData);
const largerJsonString = JSON.stringify(largerFormatted);

console.log('\n\nLarger payload:');
console.log(JSON.stringify(largerFormatted, null, 2));
console.log('\nLarger JSON string length:', largerJsonString.length);

// Find what's around position 523 in the larger example
if (largerJsonString.length >= 523) {
  const start = Math.max(0, 523 - 30);
  const end = Math.min(largerJsonString.length, 523 + 30);
  
  console.log('\nAround position 523:');
  console.log('Character at 523:', largerJsonString[523]);
  console.log('Context:', largerJsonString.substring(start, end));
  
  // Mark the position
  const marker = ' '.repeat(523 - start) + '^';
  console.log('        ', marker);
  
  // Find which field
  const beforePos = largerJsonString.substring(0, 523);
  const lastQuoteIndex = beforePos.lastIndexOf('"');
  const lastColonIndex = beforePos.lastIndexOf(':');
  
  if (lastQuoteIndex > lastColonIndex) {
    // We're in a key
    const keyStart = beforePos.lastIndexOf('"', lastQuoteIndex - 1);
    console.log('In key:', beforePos.substring(keyStart + 1, lastQuoteIndex));
  } else {
    // We're in a value
    const valueStart = lastColonIndex + 1;
    console.log('In value after key at:', beforePos.substring(beforePos.lastIndexOf('"', lastColonIndex - 2) + 1, lastColonIndex - 1));
  }
}

// Check timestamp format
console.log('\n\nTimestamp check:');
console.log('created_at format:', largerFormatted.created_at);
console.log('updated_at format:', largerFormatted.updated_at);
console.log('Sample Date ISO:', new Date().toISOString());