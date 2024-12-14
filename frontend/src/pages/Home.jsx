import React, { useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Map from "../components/Map";
import Navbar from "../components/Navbar"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Home() {

  return (
    <div className="pt-16">
      <Navbar />
      <Map />
    </div>
  );
}

export default Home;