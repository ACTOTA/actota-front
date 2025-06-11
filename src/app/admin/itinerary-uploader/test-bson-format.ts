import { formatPayloadForBackend } from './utils';

// Test the BSON formatting function
const testPayload = {
  _id: {
    $oid: "676e9ee4c5b00c1bf5e16a00"
  },
  name: "Colorado Winter Adventure",
  city: "Denver",
  state: "Colorado",
  country: "USA",
  min_group: 1,
  max_group: 8,
  price_per_person: 2500,
  duration: 7,
  hero_image: "https://example.com/hero.jpg",
  coordinates: [-104.8214, 38.8339],
  days: [
    {
      day_id: "day_1",
      day_number: 1,
      items: [
        {
          item_id: "item_1",
          type: "activity",
          details: {
            activity_id: "act_1",
            name: "Skiing at Vail",
            duration: 5,
            price_per_person: 200,
            activity_type: "skiing",
            start_time: 9
          }
        }
      ]
    }
  ]
};

const formattedPayload = formatPayloadForBackend(testPayload);
console.log('Formatted BSON Payload:', JSON.stringify(formattedPayload, null, 2));