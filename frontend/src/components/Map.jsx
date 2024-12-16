import React, { useRef, useEffect, useState } from "react";
import { LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { use } from "react";
import api from "../api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Map() {
  const mapRef = useRef(null); // Reference to the map container
  const mapInstanceRef = useRef(null); // Reference to the map instance
  const [mapType, setMapType] = useState("State"); // "State", "County", "Zip Code", or "City"
  const [mapHeight, setMapHeight] = useState("100vh")
  const [selectedOption, setSelectedOption] = useState("option1");
  const [currFeature, setCurrFeature] = useState(null);
  const [currStateFeature, setCurrStateFeature] = useState(null);
  const [clickLatLng, setClickLatLng] = useState(null);
  let lastInteractedFeatureIds = [];
  let lastClickedFeatureIds = [];
  const infoWindowRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleClick = (e, featureLayer, map) => {
    //console.log("CurrFeature", e.features[0]);
    const feature = e.features[0];
    setCurrFeature(feature);
    setClickLatLng(e.latLng);
    lastClickedFeatureIds = e.features.map((f) => f.placeId);
    lastInteractedFeatureIds = [];
  };

  const handleStateClick = (e) => {
    //console.log("StateFeature", e.features[0]);
    const feature = e.features[0];
    setClickLatLng(e.latLng);
    setCurrStateFeature(feature);
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
  useEffect(() => {
    if (currFeature && currStateFeature && mapInstanceRef.current) {
      createInfoWindow({ latLng: clickLatLng }, mapInstanceRef.current);
    }
  }, [currFeature, currStateFeature]);
  
  async function createInfoWindow(event, map) {
    //console.log("Creating InfoWindow");
    //console.log(currFeature);
    //console.log(currStateFeature);
  
    const currPlace = await currFeature.fetchPlace();
    const currState = await currStateFeature.fetchPlace();
    let content;

    switch(mapType) {
      case "State":
        try {
          console.log(currState.displayName);
          const response = await api.get(`/api/states/snapshot/?state=${currState.displayName}`);
          const stateData = response.data[0];
          console.log("State Data:", stateData);
          
          if (stateData) {
            content = `
              <span style="font-size:small">
                State: ${currState.displayName ?? "No data available"}<br/>
                Average Crime Rate: ${stateData["Average Crime Rate"] ?? "No data available"}<br/>
                Average Income: ${stateData["Average Median Family Income"] ?? "No data available"}<br/>
              </span>
            `;
          } else {
            content = `<span style="font-size:small">No data available for ${currState.displayName}</span>`;
          }
        } catch (error) {
          console.error("Error fetching state data:", error);
          content = `<span style="font-size:small">Error fetching state data</span>`;
        }
        break;
      case "County":
        try {
          console.log(currPlace.displayName);
          const response = await api.get(`/api/counties/snapshot/?county=${currPlace.displayName.replace(/ County$/, '')}&state=${currState.displayName}`);
          const countyData = response.data[0];
          console.log("County Data:", countyData);
          
          if (countyData) {
            content = `
              <span style="font-size:small">
                County: ${currPlace.displayName}<br/>
                State: ${currState.displayName}<br/>
                Food Cost: ${countyData["Food Cost"] ?? "No data available"}<br/>
                Housing Cost: ${countyData["Housing Cost"] ?? "No data available"}<br/>
                Healthcare Cost: ${countyData["Healthcare Cost"] ?? "No data available"}<br/>
              </span>
            `;
          } else {
            content = `<span style="font-size:small">No data available for ${currPlace.displayName}</span>`;
          }
        } catch (error) {
          console.error("Error fetching state data:", error);
          content = `<span style="font-size:small">Error fetching state data</span>`;
        }
        break;
      case "Zip Code":
        try{
          console.log(currPlace.displayName);
          const response = await api.get(`/api/zipcodes/snapshot/?zipcode=${currPlace.displayName}`);
          console.log(response);
          const zipCodeData = response.data;
          console.log("Zip Code Data:", zipCodeData);
            
          if (zipCodeData) {
          content = `
            <span style="font-size:small">
              Zip Code: ${currPlace.displayName}<br/>
              State: ${currState.displayName}<br/>
              Average Housing Price: ${zipCodeData["Avg Housing Cost"] ?? "No data available"}<br/>
            </span>
          `;
          } else {
            content = `<span style="font-size:small">No data available for ${currPlace.displayName}</span>`;
          }
        } catch (error) {
          console.error("Error fetching zip code data:", error);
          content = `<span style="font-size:small">Error fetching zip code data</span>`;
        }
        break;
      case "City":
        try{
          console.log(currPlace.displayName);
          const response = await api.get(`/api/cities/snapshot/?city=${currPlace.displayName}&state=${currState.displayName}`);
          const cityData = response.data[0];
          console.log("City Data:", cityData);
            
          if (cityData) {
          content = `
            <span style="font-size:small">
              City: ${currPlace.displayName}<br/>
              State: ${currState.displayName}<br/>
              Latitude: ${cityData["Lat"] ?? "No data available"}<br/>
              Longitude: ${cityData["Lng"] ?? "No data available"}<br/>
              Population: ${cityData["Population"] ?? "No data available"}<br/>
            </span>
          `;
          } else {
            content = `<span style="font-size:small">No data available for ${currPlace.displayName}</span>`;
          }
        } catch (error) {
          content = `<span style="font-size:small">Error fetching city data</span>`;
        }
        break;
    }

    
  
    // Use the event's latLng position for the InfoWindow
    updateInfoWindow(content, event.latLng, map);
  }

  function updateInfoWindow(content, center, map) {
    const infoWindow = infoWindowRef.current;
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
    const stateFeatureLayer = loadFeatureLayer(map, "State");

    // Initialize the InfoWindow
    infoWindowRef.current = new InfoWindow({});

    featureLayer.style = applyStyle;
    stateFeatureLayer.style = applyStyle;
    featureLayer.addListener("mousemove", (e) => handleMouseMove(e, featureLayer));
    featureLayer.addListener("click", (e) => handleClick(e, featureLayer, map));
    stateFeatureLayer.addListener("click", (e) => handleStateClick(e, stateFeatureLayer, map));
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
    return featureLayer;
  };

  useEffect(() => {
    if (mapRef.current && window.google) {
      initMap();
    }
  }, [isLoaded, mapRef, mapType]);

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
    <div className="relative" style={{ height: mapHeight }}>
      <div
        id="map"
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
      ></div>

      {/* Radio Buttons Overlay */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <label className="block mb-2">
          <input
            type="radio"
            name="mapOption"
            value="option1"
            checked={selectedOption === "option1"}
            onChange={(e) => { setSelectedOption(e.target.value); setMapType("State"); }}
            className="mr-2"
          />
          States
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            name="mapOption"
            value="option2"
            checked={selectedOption === "option2"}
            onChange={(e) => { setSelectedOption(e.target.value); setMapType("County"); }}
            className="mr-2"
          />
          Counties
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            name="mapOption"
            value="option3"
            checked={selectedOption === "option3"}
            onChange={(e) => { setSelectedOption(e.target.value); setMapType("Zip Code"); }}
            className="mr-2"
          />
          Zip Codes
        </label>
        <label className="block">
          <input
            type="radio"
            name="mapOption"
            value="option4"
            checked={selectedOption === "option4"}
            onChange={(e) => { setSelectedOption(e.target.value); setMapType("City"); }}
            className="mr-2"
          />
          Cities
        </label>
      </div>
    </div>
  );
}

export default Map;