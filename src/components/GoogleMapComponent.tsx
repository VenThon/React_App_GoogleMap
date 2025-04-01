import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "80vw",
  height: "550px",
};

const initialCenter = {
  lat: 11.5564, // Phnom Penh latitude
  lng: 104.9282, // Phnom Penh longitude
};

const GoogleMapComponent: React.FC = () => {
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState(initialCenter);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const handleShowCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocation);
          setCenter(userLocation); // Move the map to the user's location
          setZoom(15); // Zoom in on the user's location
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <div>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
          {/* Show a marker at user's current location if available */}
          {userLocation && <Marker position={userLocation} />}
        </GoogleMap>
        <button
          onClick={handleShowCurrentLocation}
          style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}
        >
          I am here
        </button>
      </div>
    </LoadScript>
  );
};

export default GoogleMapComponent;
