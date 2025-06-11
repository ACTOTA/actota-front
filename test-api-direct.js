// Test the API directly with different date formats
const https = require('https');

// Test different date formats
const testFormats = [
  {
    name: 'ISO String',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'Unix Timestamp',
    created_at: Date.now(),
    updated_at: Date.now()
  },
  {
    name: 'MongoDB Date Format',
    created_at: { $date: new Date().toISOString() },
    updated_at: { $date: new Date().toISOString() }
  },
  {
    name: 'No timestamps',
    created_at: undefined,
    updated_at: undefined
  }
];

async function testDateFormat(formatInfo) {
  const payload = {
    trip_name: `Test Trip ${formatInfo.name}`,
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
          time: "09:00:00",
          type: "activity",
          activity_id: "680e9f193217b9ad0f27cee8"
        }
      ]
    },
    images: []
  };

  // Add timestamps if defined
  if (formatInfo.created_at !== undefined) {
    payload.created_at = formatInfo.created_at;
  }
  if (formatInfo.updated_at !== undefined) {
    payload.updated_at = formatInfo.updated_at;
  }

  const jsonData = JSON.stringify(payload);
  
  console.log(`\n=== Testing ${formatInfo.name} ===`);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('JSON length:', jsonData.length);
  
  // Find what's at position 523 if the string is long enough
  if (jsonData.length >= 523) {
    console.log('Character at position 523:', jsonData[523]);
    const start = Math.max(0, 523 - 30);
    const end = Math.min(jsonData.length, 523 + 30);
    console.log('Context:', jsonData.substring(start, end));
    console.log('        ', ' '.repeat(523 - start) + '^');
  }

  // Make the request (commented out to avoid actual API calls)
  console.log('Would send this payload to API...');
}

// Test each format
async function runTests() {
  for (const format of testFormats) {
    await testDateFormat(format);
  }
}

runTests();