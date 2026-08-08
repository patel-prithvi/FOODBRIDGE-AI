/**
 * Location Service using Web Geolocation API and OpenStreetMap Nominatim for Reverse/Forward Geocoding.
 */

// 1. Get browser coordinates via Geolocation API
export const getCurrentCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error('Location permission was denied. Please allow location access or enter your location manually.')
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new Error('Location information is unavailable. Please try again or enter location manually.')
            );
            break;
          case error.TIMEOUT:
            reject(new Error('The request to detect location timed out. Please try again.'));
            break;
          default:
            reject(new Error('An error occurred while detecting location.'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// 2. Reverse Geocode lat/lng to readable address & city
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'FoodBridgeAI/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();
    const addr = data.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.county ||
      addr.state_district ||
      '';

    const streetComponents = [
      addr.building || addr.house_number,
      addr.road || addr.street,
      addr.suburb || addr.neighbourhood || addr.residential,
    ].filter(Boolean);

    const address =
      streetComponents.length > 0
        ? streetComponents.join(', ')
        : data.display_name?.split(',').slice(0, 3).join(', ') || '';

    return {
      address: address || data.display_name || 'Detected Location',
      city: city || 'Local Area',
      lat,
      lng,
    };
  } catch (error) {
    console.error('[Reverse Geocode Error]', error);
    return {
      address: `Lat: ${lat}, Lng: ${lng}`,
      city: 'Unknown City',
      lat,
      lng,
    };
  }
};

// 3. Forward Geocode manual address & city to coordinates
export const forwardGeocode = async (address, city) => {
  try {
    const query = `${address}, ${city}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'FoodBridgeAI/1.0',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: Number(parseFloat(data[0].lat).toFixed(6)),
        lng: Number(parseFloat(data[0].lon).toFixed(6)),
      };
    }
    return null;
  } catch (error) {
    console.error('[Forward Geocode Error]', error);
    return null;
  }
};
