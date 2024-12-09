import React, { useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

function Home() {
  const [map, setMap] = useState(null); // Reference to the map instance

  // Function to search for a neighborhood
  const searchNeighborhood = (query) => {
    if (!map || !window.google || !window.google.maps.places) {
      console.error("Google Maps or PlacesService is not loaded yet.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(
      {
        query,
        fields: ["geometry"],
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          map.setZoom(14); // Zoom in on the location
        } else {
          console.error("Place not found:", status);
        }
      }
    );
  };

  return (
    <div>
      <div style={{ padding: "10px", background: "#f8f8f8" }}>
        <input
          type="text"
          placeholder="Search Neighborhood"
          onKeyDown={(e) => {
            if (e.key === "Enter") searchNeighborhood(e.target.value);
          }}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
      </div>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={(mapInstance) => setMap(mapInstance)} // Set the map instance when loaded
        />
      </LoadScript>
    </div>
  );
}

export default Home;