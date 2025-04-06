import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useCallback } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 11.5564,
  lng: 104.9282,
};

const GoogleMapComponent = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        
        // Center map on user's location but keep default marker visible
        if (map) {
          map.panTo(location);
          map.setZoom(15); // Zoom closer to user's location
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setError(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }, [map]);

  return (
    <div style={{ position: 'relative' }}>
      <LoadScript 
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
        onLoad={() => setApiLoaded(true)}
      >
        {apiLoaded && (
          <GoogleMap 
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={(map) => setMap(map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* Permanent default center marker */}
            <Marker 
              position={defaultCenter}
              label="D"
              title="Default Location"
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
            
            {/* User location marker (appears after clicking button) */}
            {userLocation && (
              <Marker 
                position={userLocation}
                label="Y"
                title="Your Location"
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>

      <div style={{ padding: "10px" }}>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          style={{ 
            padding: "10px 20px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "10px 0"
          }}
        >
          {isLoading ? "Locating..." : "Show My Location"}
        </button>
        
        {error && (
          <div style={{ color: "red" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapComponent;