// Debug script to check the format payload
const { formatPayloadForBackend } = require('./src/app/admin/itinerary-uploader/utils.ts');

// Sample data with minimal required fields
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
console.log('\nJSON length:', jsonString.length);

// Find character at position 523
if (jsonString.length >= 523) {
  const start = Math.max(0, 523 - 50);
  const end = Math.min(jsonString.length, 523 + 50);
  
  console.log('\nAround position 523:');
  console.log('Character at 523:', jsonString[523]);
  console.log('Context:', jsonString.substring(start, end));
  
  // Find the field
  let depth = 0;
  let currentKey = '';
  let inKey = false;
  let inValue = false;
  
  for (let i = 0; i < jsonString.length && i <= 523; i++) {
    const char = jsonString[i];
    
    if (char === '"') {
      if (i === 0 || jsonString[i-1] !== '\\') {
        if (!inKey && !inValue) {
          inKey = true;
          currentKey = '';
        } else if (inKey) {
          inKey = false;
          if (jsonString[i+1] === ':') {
            // This was a key
            inValue = true;
          }
        } else if (inValue) {
          inValue = false;
        }
      }
    } else if (inKey) {
      currentKey += char;
    }
    
    if (char === '{' || char === '[') depth++;
    if (char === '}' || char === ']') depth--;
    
    if (i === 523) {
      console.log('\nAt position 523:');
      console.log('Current key:', currentKey);
      console.log('In key?', inKey);
      console.log('In value?', inValue);
      console.log('Depth:', depth);
    }
  }
}

// Check the timestamps specifically
console.log('\n\nTimestamp format check:');
console.log('created_at:', formatted.created_at);
console.log('updated_at:', formatted.updated_at);
console.log('Type of created_at:', typeof formatted.created_at);
console.log('Type of updated_at:', typeof formatted.updated_at);