import React, { useRef, useEffect, useState } from "react";
import { LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { use } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Map() {
  const mapRef = useRef(null); // Reference to the map container
  const mapInstanceRef = useRef(null); // Reference to the map instance
  const mapType = "State"; // "State", "County", "Zip Code", or "City"
  const [mapHeight, setMapHeight] = useState("100vh");
  let lastInteractedFeatureIds = [];
  let lastClickedFeatureIds = [];
  let infoWindow;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleClick = (e, featureLayer, map) => {
    lastClickedFeatureIds = e.features.map((f) => f.placeId);
    lastInteractedFeatureIds = [];
    featureLayer.style = applyStyle;
    createInfoWindow(e, map);
  };

  const handleMouseMove = (e, featureLayer) => {
    lastInteractedFeatureIds = e.features.map((f) => f.placeId);
    featureLayer.style = applyStyle;
  };

  const applyStyle = (params) => {
    const placeId = params.feature.placeId;
    if (lastClickedFeatureIds.includes(placeId)) {
      return styleClicked;
    }
    if (lastInteractedFeatureIds.includes(placeId)) {
      return styleMouseMove;
    }
    return styleDefault;
  };

  const styleDefault = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 2.0,
    fillColor: "white",
    fillOpacity: 0.1,
  };
  const styleClicked = {
    ...styleDefault,
    fillColor: "#810FCB",
    fillOpacity: 0.5,
  };
  const styleMouseMove = {
    ...styleDefault,
    strokeWeight: 4.0,
  };

  async function createInfoWindow(event, map) {
    let feature = event.features[0];
    if (!feature.placeId) return;

    // Fetch the place details
    const place = await feature.fetchPlace();
    const content = `
      <span style="font-size:small">
        Display name: ${place.displayName}<br/>
        Place ID: ${feature.placeId}<br/>
        Feature type: ${feature.featureType}
      </span>
    `;

    // Update the InfoWindow
    updateInfoWindow(content, event.latLng, map);
  }

  function updateInfoWindow(content, center, map) {
    if (!infoWindow) {
      console.error("InfoWindow is not initialized.");
      return;
    }
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
      map,
      shouldFocus: false,
    });
  }

  const initMap = async () => {
    if (!window.google) {
      console.error("Google Maps API is not loaded.");
      return;
    }

    if (!mapRef.current) {
      console.error("Map container is not attached.");
      return;
    }

    // Clear any existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }

    const { Map, InfoWindow } = await google.maps.importLibrary("maps");

    // Create a new map instance
    const map = new Map(mapRef.current, {
      center: { lat: 39, lng: -98 },
      zoom: 5,
      mapId: "bacf0f5025ebad56",
    });

    mapInstanceRef.current = map; // Store the map instance in a ref

    const featureLayer = loadFeatureLayer(map, mapType);

    // Initialize the InfoWindow
    infoWindow = new InfoWindow({});

    // Reset styles on map mousemove
    map.addListener("mousemove", () => {
      if (lastInteractedFeatureIds?.length) {
        lastInteractedFeatureIds = [];
        featureLayer.style = applyStyle;
      }
    });

    featureLayer.style = applyStyle;
  };

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
    featureLayer.addListener("mousemove", (e) => handleMouseMove(e, featureLayer));
    featureLayer.addListener("click", (e) => handleClick(e, featureLayer, map));
    return featureLayer;
  };

  useEffect(() => {
    if (mapRef.current && window.google) {
      initMap();
    }
  }, [mapRef, mapType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initMap();
      }
    }, 100); // Delay initialization by 100ms
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 64;
      setMapHeight(`calc(100vh - ${navbarHeight}px)`);
    };

    // Update height on load and window resize
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <div
        id="map"
        ref={mapRef}
        style={{ width: "100%", height: mapHeight }}
      ></div>
    </div>
  );
}

export default Map;