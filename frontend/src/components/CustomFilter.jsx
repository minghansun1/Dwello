import { useState } from "react";
import api from "../api";

function CustomFilter() {
  const rangeBoxes = [
    { title: "Median Home Price" },
    { title: "Crime" },
    { title: "Population Density" },
    { title: "Population" },
    { title: "Cost of Living" },
    { title: "Natural Disaster Count" },
  ];
  const boxes = [
    {title: "City"},
    {title: "Zip Code"},
    {title: "State"},
    {title: "County"},
  ];
  const [minMedianHomePrice, setMinMedianHomePrice] = useState(0);
  const [maxMedianHomePrice, setMaxMedianHomePrice] = useState(10000000);
  const [minCrime, setMinCrime] = useState(0);
  const [maxCrime, setMaxCrime] = useState(10000);
  const [minPopulationDensity, setMinPopulationDensity] = useState(0);
  const [maxPopulationDensity, setMaxPopulationDensity] = useState(10000);
  const [minPopulation, setMinPopulation] = useState(0);
  const [maxPopulation, setMaxPopulation] = useState(100000000);
  const [minCostOfLiving, setMinCostOfLiving] = useState(0);
  const [maxCostOfLiving, setMaxCostOfLiving] = useState(10000000);
  const [minNaturalDisasterCount, setMinNaturalDisasterCount] = useState(0);
  const [maxNaturalDisasterCount, setMaxNaturalDisasterCount] = useState(10000);
  const [minLatitude, setMinLatitude] = useState(-180);
  const [maxLatitude, setMaxLatitude] = useState(180);
  const [minLongitude, setMinLongitude] = useState(-90);
  const [maxLongitude, setMaxLongitude] = useState(90);
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");


  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Custom Filtering
        </h2>
        {/* First Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Median Home Price */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Median Home Price
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minMedianHomePrice}
                onChange={(e) => setMinMedianHomePrice(parseInt(e.target.value) || 0)}
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxMedianHomePrice}
                onChange={(e) => setMaxMedianHomePrice(parseInt(e.target.value) || 10000000)}
              />
            </div>
          </div>

          {/* Crime */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Crime</h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minCrime}
                onChange={(e) => setMinCrime(parseInt(e.target.value) || 0)}
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxCrime}
                onChange={(e) => setMaxCrime(parseInt(e.target.value) || 10000)}
              />
            </div>
          </div>

          {/* Population Density */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Population Density
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minPopulationDensity}
                onChange={(e) =>
                  setMinPopulationDensity(parseInt(e.target.value) || 0)
                }
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxPopulationDensity}
                onChange={(e) =>
                  setMaxPopulationDensity(parseInt(e.target.value) || 10000)
                }
              />
            </div>
          </div>

          {/* Population*/}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Population
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minPopulation}
                onChange={(e) =>
                  setMinPopulation(parseInt(e.target.value) || 0)
                }
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxPopulation}
                onChange={(e) =>
                  setMaxPopulation(parseInt(e.target.value) || 100000000)
                }
              />
            </div>
          </div>

          {/* Cost of Living */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Cost of Living
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minCostOfLiving}
                onChange={(e) =>
                  setMinCostOfLiving(parseInt(e.target.value) || 0)
                }
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxCostOfLiving}
                onChange={(e) =>
                  setMaxCostOfLiving(parseInt(e.target.value) || 10000000)
                }
              />
            </div>
          </div>

          {/* Natural Disaster Count */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Natural Disaster Count
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minNaturalDisasterCount}
                onChange={(e) =>
                  setMinNaturalDisasterCount(parseInt(e.target.value) || 0)
                }
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxNaturalDisasterCount}
                onChange={(e) =>
                  setMaxNaturalDisasterCount(parseInt(e.target.value) || 10000)
                }
              />
            </div>
          </div>

          {/* Latitude */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Latitude
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minLatitude}
                onChange={(e) =>
                  setMinLatitude(parseInt(e.target.value) || -180)
                }
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxLatitude}
                onChange={(e) =>
                  setMaxLatitude(parseInt(e.target.value) || 180)
                }
              />
            </div>
          </div>

          {/* Longitude */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Longitude
            </h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={minLongitude}
                onChange={(e) =>
                  setMinLongitude(parseInt(e.target.value) || -90)
                }
              />
              <input
                type="text"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-24"
                value={maxLongitude}
                onChange={(e) =>
                  setMaxLongitude(parseInt(e.target.value) || 90)
                }
              />
            </div>
          </div>
        </div>
  
        {/* Spacer */}
        <div className="mt-6"></div>
  
        {/* Second Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">City</h3>
            <input
              type="text"
              placeholder="Enter City"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Zip Code */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Zip Code</h3>
            <input
              type="text"
              placeholder="Enter Zip Code"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>

          {/* County */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">County</h3>
            <input
              type="text"
              placeholder="Enter County"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
          </div>

          {/* City */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">State</h3>
            <input
              type="text"
              placeholder="Enter State"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={city}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                    console.log("Button clicked");
                    const searchParams = {
                        "Min Median Home Price": minMedianHomePrice,
                        "Max Median Home Price": maxMedianHomePrice,
                        "Min Crime": minCrime,
                        "Max Crime": maxCrime,
                        "Min Population Density": minPopulationDensity,
                        "Max Population Density": maxPopulationDensity,
                        "Min Population": minPopulation,
                        "Max Population": maxPopulation,
                        "Min Cost of Living": minCostOfLiving,
                        "Max Cost of Living": maxCostOfLiving,
                        "Min Natural Disaster Count": minNaturalDisasterCount,
                        "Max Natural Disaster Count": maxNaturalDisasterCount,
                        "Min Latitude": minLatitude,
                        "Max Latitude": maxLatitude,
                        "Min Longitude": minLongitude,
                        "Max Longitude": maxLongitude,
                        "City": city,
                        "Zip Code": zipCode,
                        "State": state,
                        "County": county,
                    };
                console.log(searchParams);
                api.post("/api/neighborhoods/preference-ranking/", searchParams)
                    .then((response) => {
                        console.log("Search results:", response.data);
                    })
                    .catch((error) => {
                        console.error("There was an error searching!", error);
                        alert("Search failed. Please try again.");
                    });
                }}
                >
                Search
            </button>
        </div>
      </div>
    </div>
  );
}

export default CustomFilter;