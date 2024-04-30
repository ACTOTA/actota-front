// useTowns.js

const towns = [
  { value: 'Alamosa', label: 'Alamosa', flag: '🌲', latlng: [37.4695, -105.8700], region: 'Colorado' },
  { value: 'Aspen', label: 'Aspen', flag: '🎿', latlng: [39.1911, -106.8175], region: 'Colorado' },
  { value: 'Basalt', label: 'Basalt', flag: '🏞️', latlng: [39.3689, -107.0328], region: 'Colorado' },
  { value: 'Black Hawk', label: 'Black Hawk', flag: '🎰', latlng: [39.7969, -105.4930], region: 'Colorado' },
  { value: 'Boulder', label: 'Boulder', flag: '🗻', latlng: [40.01499, -105.2705], region: 'Colorado' },
  { value: 'Breckenridge', label: 'Breckenridge', flag: '⛷️', latlng: [39.4817, -106.0384], region: 'Colorado' },
  { value: 'Buena Vista', label: 'Buena Vista', flag: '🌄', latlng: [38.8422, -106.1311], region: 'Colorado' },
  { value: 'Carbondale', label: 'Carbondale', flag: '🏞️', latlng: [39.4022, -107.2112], region: 'Colorado' },
  { value: 'Cañon City', label: 'Cañon City', flag: '🏞️', latlng: [38.4494, -105.2253], region: 'Colorado' },
  { value: 'Colorado Springs', label: 'Colorado Springs', flag: '🏔️', latlng: [38.8339, -104.8214], region: 'Colorado' },
  { value: 'Cortez', label: 'Cortez', flag: '🌲', latlng: [37.3489, -108.5859], region: 'Colorado' },
  { value: 'Crested Butte', label: 'Crested Butte', flag: '🎿', latlng: [38.8697, -106.9878], region: 'Colorado' },
  { value: 'Denver', label: 'Denver', flag: '🌄', latlng: [39.7392, -104.9903], region: 'Colorado' },
  { value: 'Dumont', label: 'Dumont', flag: '🏞️', latlng: [39.7611, -105.6281], region: 'Colorado' },
  { value: 'Durango', label: 'Durango', flag: '🚂', latlng: [37.2753, -107.8801], region: 'Colorado' },
  { value: 'Estes Park', label: 'Estes Park', flag: '🦌', latlng: [40.3772, -105.5217], region: 'Colorado' },
  { value: 'Evergreen', label: 'Evergreen', flag: '🌲', latlng: [39.6333, -105.3172], region: 'Colorado' },
  { value: 'Frisco', label: 'Frisco', flag: '🏞️', latlng: [39.5744, -106.0975], region: 'Colorado' },
  { value: 'Fruita', label: 'Fruita', flag: '🚴', latlng: [39.1589, -108.7289], region: 'Colorado' },
  { value: 'Georgetown', label: 'Georgetown', flag: '🏔️', latlng: [39.7061, -105.6975], region: 'Colorado' },
  { value: 'Glenwood Springs', label: 'Glenwood Springs', flag: '♨️', latlng: [39.5505, -107.3248], region: 'Colorado' },
  { value: 'Golden', label: 'Golden', flag: '🏞️', latlng: [39.7555, -105.2211], region: 'Colorado' },
  { value: 'Grand Lake', label: 'Grand Lake', flag: '🚣', latlng: [40.2522, -105.8233], region: 'Colorado' },
  { value: 'Gunnison', label: 'Gunnison', flag: '🎣', latlng: [38.5458, -106.9253], region: 'Colorado' },
  { value: 'Hot Sulphur Springs', label: 'Hot Sulphur Springs', flag: '♨️', latlng: [40.0731, -106.1027], region: 'Colorado' },
  { value: 'Idaho Springs', label: 'Idaho Springs', flag: '⛏️', latlng: [39.7425, -105.5136], region: 'Colorado' },
  { value: 'Lakewood', label: 'Lakewood', flag: '🌲', latlng: [39.7047, -105.0814], region: 'Colorado' },
  { value: 'Loveland', label: 'Loveland', flag: '❤️', latlng: [40.3978, -105.0749], region: 'Colorado' },
  { value: 'Lyons', label: 'Lyons', flag: '🎸', latlng: [40.2247, -105.2714], region: 'Colorado' },
  { value: 'Manitou Springs', label: 'Manitou Springs', flag: '♨️', latlng: [38.8597, -104.9172], region: 'Colorado' },
  { value: 'Montrose', label: 'Montrose', flag: '🏞️', latlng: [38.4783, -107.8762], region: 'Colorado' },
  { value: 'Morrison', label: 'Morrison', flag: '🎤', latlng: [39.6536, -105.1911], region: 'Colorado' },
  { value: 'Nederland', label: 'Nederland', flag: '🎸', latlng: [39.9614, -105.5108], region: 'Colorado' },
  { value: 'Ouray', label: 'Ouray', flag: '🏞️', latlng: [38.0228, -107.6715], region: 'Colorado' },
  { value: 'Pagosa Springs', label: 'Pagosa Springs', flag: '♨️', latlng: [37.2695, -107.0098], region: 'Colorado' },
  { value: 'Palisade', label: 'Palisade', flag: '🍇', latlng: [39.1103, -108.3509], region: 'Colorado' },
  { value: 'Salida', label: 'Salida', flag: '🚣', latlng: [38.5347, -105.9989], region: 'Colorado' },
  { value: 'Snowmass Village', label: 'Snowmass Village', flag: '⛷️', latlng: [39.2130, -106.9378], region: 'Colorado' },
  { value: 'Telluride', label: 'Telluride', flag: '🏔️', latlng: [37.9375, -107.8123], region: 'Colorado' },
  { value: 'Twin Lakes', label: 'Twin Lakes', flag: '🏞️', latlng: [39.0820, -106.3800], region: 'Colorado' },
  { value: 'Winter Park', label: 'Winter Park', flag: '🏂', latlng: [39.8917, -105.7631], region: 'Colorado' },

];

const useTowns = () => {
  const getAll = () => towns;

  const getByValue = (value: string) => {
    return towns.find((item) => item.value === value);
  }

  return {
    getAll,
    getByValue
  }
};

export default useTowns;
