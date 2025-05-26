// Test the backend API directly
const axios = require('axios');

async function testBackendAPI() {
  // Simple test payload without timestamps
  const testPayload = {
    trip_name: "Direct Backend Test",
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

  console.log('Test payload:', JSON.stringify(testPayload, null, 2));
  console.log('Payload length:', JSON.stringify(testPayload).length);

  try {
    // First test: without timestamps
    console.log('\n=== Test 1: Without timestamps ===');
    await sendRequest(testPayload);

    // Second test: with ISO timestamps
    console.log('\n=== Test 2: With ISO timestamps ===');
    const withTimestamps = {
      ...testPayload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await sendRequest(withTimestamps);

    // Third test: with Unix timestamps
    console.log('\n=== Test 3: With Unix timestamps ===');
    const withUnixTimestamps = {
      ...testPayload,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    await sendRequest(withUnixTimestamps);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function sendRequest(payload) {
  const payloadString = JSON.stringify(payload);
  console.log(`Payload length: ${payloadString.length}`);
  
  // Check position 523 if the payload is long enough
  if (payloadString.length >= 523) {
    console.log(`Character at position 523: '${payloadString[523]}'`);
    const start = Math.max(0, 523 - 30);
    const end = Math.min(payloadString.length, 523 + 30);
    console.log(`Context: ${payloadString.substring(start, end)}`);
  }

  try {
    const response = await axios.post(
      'http://localhost:8080/api/itineraries/featured/add',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          'Authorization': 'Bearer test-token'
        }
      }
    );
    
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Backend error:', error.response.data);
      console.error('Status:', error.response.status);
      
      // Check for position 523 error
      const errorData = JSON.stringify(error.response.data);
      if (errorData.includes('523')) {
        console.error('>>> POSITION 523 ERROR DETECTED <<<');
        console.error('Full error:', errorData);
      }
    } else {
      console.error('Request error:', error.message);
    }
  }
}

// Run if axios is available
try {
  testBackendAPI();
} catch (e) {
  console.log('Note: Install axios with "npm install axios" to run this test');
  console.log('Or use the test page at /admin/itinerary-test instead');
}