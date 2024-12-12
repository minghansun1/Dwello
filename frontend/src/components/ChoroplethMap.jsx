import React, { useRef, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function ChoroplethMap() {
  const mapRef = useRef(null);
  const mapType = "County"; // "State", "County", "Zip Code", or "City"

  useEffect(() => {
    const initMap = async () => {
      if (!window.google) {
        console.error("Google Maps API is not loaded.");
        return;
      }

      const { Map } = await google.maps.importLibrary("maps");

      const map = new Map(mapRef.current, {
        center: { lat: 39, lng: -98 }, // United States
        zoom: 5,
        mapId: "bacf0f5025ebad56",
      });

      const featureLayer = loadFeatureLayer(map, mapType);
      if (featureLayer) {
        applyLayerStyle(featureLayer);
      }
    };

    initMap();
  }, [mapType]); // Re-initialize if mapType changes

  const loadFeatureLayer = (map, mapType) => {
    let featureLayer;
    switch (mapType) {
      case "State":
        featureLayer = map.getFeatureLayer(
          google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
        );
        break;
      case "County":
        featureLayer = map.getFeatureLayer(
          google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_2
        );
        break;
      case "Zip Code":
        featureLayer = map.getFeatureLayer(
          google.maps.FeatureType.POSTAL_CODE
        );
        break;
      case "City":
        featureLayer = map.getFeatureLayer(
          google.maps.FeatureType.LOCALITY
        );
        break;
      default:
        console.error("Invalid map type:", mapType);
        return null;
    }
    return featureLayer;
  };

  const applyLayerStyle = (featureLayer) => {
    featureLayer.style = {
      fillColor: "red",
      fillOpacity: 0.5,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3.0,
    };
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div
        id="map"
        ref={mapRef}
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </LoadScript>
  );
}

export default ChoroplethMap;