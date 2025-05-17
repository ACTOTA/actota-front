// Debug script to find field at position 523 in JSON
const samplePayload = {
  title: "Colorado's Adventure Tour",
  description: "Explore the heart of Colorado with this thrilling outdoor adventure tour. Experience breathtaking landscapes, exciting activities, and unforgettable memories in the Centennial State.",
  images: [],
  days: [
    {
      day: 1,
      location: "Denver",
      activities: [
        {
          name: "Morning Transportation",
          type: "transportation",
          duration: 1,
          description: "Transportation from Denver Airport to downtown Denver",
          price: 50,
          startTime: 28800000,
          endTime: 32400000,
          transportationType: "sedan"
        },
        {
          name: "Downtown Exploration",
          type: "activity",
          duration: 2,
          description: "Explore downtown Denver's attractions",
          price: 0,
          startTime: 32400000,
          endTime: 39600000
        },
        {
          name: "Evening Hotel",
          type: "accommodation",
          duration: 720,
          description: "Stay at downtown hotel",
          price: 150,
          startTime: 68400000,
          endTime: 111600000,
          accommodationType: "hotel"
        }
      ]
    }
  ],
  basePrice: 1500,
  totalActivities: 12,
  totalFreeActivities: 3,
  totalTransportation: 4,
  primaryLocation: "Colorado",
  categories: ["adventure", "outdoors"],
  startDates: [
    new Date("2024-06-15"),
    new Date("2024-07-15"),
    new Date("2024-08-15")
  ],
  locations: ["Denver", "Rocky Mountain National Park", "Aspen", "Vail"],
  durationDays: 4,
  baseActivitiesIncluded: "All main activities, accommodations, and transportation included in base price"
};

// Convert to JSON string with proper handling
const jsonString = JSON.stringify(samplePayload, (key, value) => {
  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
});

console.log('Full JSON string:');
console.log(jsonString);
console.log('\nJSON length:', jsonString.length);

// Find what's at position 523
if (jsonString.length >= 523) {
  const start = Math.max(0, 523 - 50);
  const end = Math.min(jsonString.length, 523 + 50);
  
  console.log('\nAround position 523:');
  console.log('Position:', 523);
  console.log('Character at 523:', jsonString[523]);
  console.log('Context:', jsonString.substring(start, end));
  
  // Mark position 523 with a pointer
  const pointer = ' '.repeat(523 - start) + '^';
  console.log('         ', pointer);
  
  // Find which field this is part of
  let currentField = '';
  let inQuotes = false;
  let depth = 0;
  
  for (let i = 0; i < 523; i++) {
    const char = jsonString[i];
    
    if (char === '"' && jsonString[i-1] !== '\\') {
      inQuotes = !inQuotes;
      if (inQuotes && jsonString[i+1] !== ':') {
        currentField = '';
      }
    }
    
    if (inQuotes && char !== '"') {
      currentField += char;
    }
    
    if (char === '{' || char === '[') depth++;
    if (char === '}' || char === ']') depth--;
  }
  
  console.log('\nField at position 523:', currentField);
  console.log('Nesting depth:', depth);
}

// Also create a position map
console.log('\n\nPosition map of key fields:');
let position = 0;
const fieldPositions = [];

const mapPositions = (obj, path = '', pos = 0) => {
  const str = JSON.stringify(obj);
  
  for (const [key, value] of Object.entries(obj)) {
    const searchStr = `"${key}":`;
    const index = str.indexOf(searchStr, pos);
    
    if (index !== -1) {
      fieldPositions.push({
        field: path ? `${path}.${key}` : key,
        position: index,
        value: typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : value
      });
    }
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      mapPositions(value, path ? `${path}.${key}` : key, index);
    }
  }
};

mapPositions(samplePayload);
fieldPositions.sort((a, b) => a.position - b.position);

fieldPositions.forEach(field => {
  if (field.position >= 480 && field.position <= 580) {
    console.log(`${field.position}: ${field.field} = ${field.value}`);
  }
});