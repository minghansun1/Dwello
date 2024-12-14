import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function Detailed() {
  const location = useLocation();
  const locationData = location.state?.data; // Access location data passed via state

  if (!locationData) {
    return (
      <div className="pt-16">
        <Navbar />
        <div className="text-center mt-4">
          <h2 className="text-xl text-gray-700">No data available for this location</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded mt-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Location Details
        </h2>
        <div className="space-y-4">
          {Object.entries(locationData).map(([key, value], index) => (
            <div key={index} className="border-b border-gray-300 pb-2">
              <h3 className="text-lg font-semibold text-gray-700 capitalize">
                {key.replace(/_/g, " ")}:
              </h3>
              <p className="text-gray-600">{value || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Detailed;