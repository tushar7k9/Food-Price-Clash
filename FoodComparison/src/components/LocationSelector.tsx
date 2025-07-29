import React, { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { useUser } from '../context/UserContext';

type Location = {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

const LocationSelector = ({ onClose }: { onClose: () => void }) => {
  const { updateLocation } = useUser();
  const [locationInput, setLocationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    
    // Mock fetching location suggestions - in a real app, this would call a location API
    if (e.target.value.length > 2) {
      // Simulate API call
      setTimeout(() => {
        const mockSuggestions = [
          { 
            name: `${e.target.value}, Koramangala, Bangalore`, 
            coordinates: { lat: 12.9279, lng: 77.6271 } 
          },
          { 
            name: `${e.target.value}, Indiranagar, Bangalore`, 
            coordinates: { lat: 12.9719, lng: 77.6412 } 
          },
          { 
            name: `${e.target.value}, HSR Layout, Bangalore`, 
            coordinates: { lat: 12.9116, lng: 77.6741 } 
          }
        ];
        setLocationSuggestions(mockSuggestions);
      }, 500);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSelectLocation = (location: Location) => {
    updateLocation(location);
    onClose();
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {

            // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
            // Perform reverse geocoding to get address from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

            const data = await response.json();

            if (data) {
              const location = {
                name: data.display_name,
                coordinates: { lat: data.lat, lng: data.lon }
              };

              updateLocation(location);
            } else {
              // Fallback if geocoding doesn't return results
              const location = {
                name: "Your Current Location",
                coordinates: { lat: latitude, lng: longitude }
              };
              updateLocation(location);
            }
          } catch (error) {
            console.error("Error during reverse geocoding:", error);
            // Fallback on error
            const location = {
              name: "Your Current Location",
              coordinates: { lat: latitude, lng: longitude }
            };
            updateLocation(location);
          } finally {
            setIsLoading(false);
            onClose();
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
          // You might want to show an error message to the user here
        }
      );
    } else {
      setIsLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-5 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Set Your Location</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <MapPin size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Enter your delivery address"
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
              value={locationInput}
              onChange={handleManualInput}
            />
          </div>
          
          {locationSuggestions.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
              {locationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectLocation(suggestion)}
                >
                  <div className="flex items-start">
                    <MapPin size={16} className="mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                    <span>{suggestion.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        
        <button
          className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-3 px-4 rounded-lg hover:shadow-md transition disabled:opacity-50"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Locating you...
            </span>
          ) : (
            <>
              <Navigation size={18} className="mr-2" />
              Use current location
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;