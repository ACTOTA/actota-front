'use client';

import { useState } from 'react';
import { clientEnv } from '@/src/lib/config/client-env';

export default function TestItineraryUpload() {
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    setStatus('Submitting...');
    
    // Minimal valid payload
    const payload = {
      trip_name: "Test Trip " + new Date().getTime(),
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
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));
    console.log('Payload length:', JSON.stringify(payload).length);

    try {
      // Get auth token from localStorage
      const userString = localStorage.getItem('user');
      let authToken = '';
      
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          authToken = userData.auth_token || '';
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      const res = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/admin/itineraries/featured/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const responseText = await res.text();
      console.log('Response status:', res.status);
      console.log('Response text:', responseText);

      setStatus(`Status: ${res.status}`);
      setResponse(responseText);

      if (!res.ok) {
        console.error('Error response:', responseText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setResponse(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Itinerary Upload</h1>
      
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Test Itinerary
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Status:</h2>
        <p className="text-gray-700">{status}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Response:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {response}
        </pre>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Debugging Steps:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open browser console (F12)</li>
          <li>Click "Submit Test Itinerary" button</li>
          <li>Check console for detailed logs</li>
          <li>Look for error at position 523</li>
          <li>Check server logs for backend errors</li>
        </ol>
      </div>
    </div>
  );
}