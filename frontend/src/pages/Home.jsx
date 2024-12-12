import React, { useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import ChoroplethMap from "../components/ChoroplethMap.jsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Home() {

  return (
    <div>
      Home
      <ChoroplethMap />
    </div>
  );
}

export default Home;