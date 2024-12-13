import React, { useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Map from "../components/Map";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Home() {

  return (
    <div>
      Home
      <Map />
    </div>
  );
}

export default Home;