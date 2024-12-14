import { useState } from "react";
import api from "../api";
import { data, useNavigate } from "react-router-dom";
import { jobs } from "../constants";

function CustomSearch(){
    const [medianHomePrice, setMedianHomePrice] = useState(0);
    const [crimeRate, setCrimeRate] = useState(0);
    const [population, setPopulation] = useState(0);
    const [populationDensity, setPopulationDensity] = useState(0);
    const [costOfLiving, setCostOfLiving] = useState(0);
    const [medianFamilyIncome, setMedianFamilyIncome] = useState(0);
    const [naturalDisasterCount, setNaturalDisasterCount] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [industry, setIndustry] = useState("");
    const [salary, setSalary] = useState(0);
    const [industryJobs1000, setIndustryJobs1000] = useState(0);
    const [medianHomePriceImportance, setMedianHomePriceImportance] = useState(0);
    const [crimeRateImportance, setCrimeRateImportance] = useState(0);
    const [populationImportance, setPopulationImportance] = useState(0);
    const [populationDensityImportance, setPopulationDensityImportance] = useState(0);
    const [costOfLivingImportance, setCostOfLivingImportance] = useState(0);
    const [medianFamilyIncomeImportance, setMedianFamilyIncomeImportance] = useState(0);
    const [naturalDisasterCountImportance, setNaturalDisasterCountImportance] = useState(0);
    const [locationImportance, setLocationImportance] = useState(0);
    const [salaryImportance, setSalaryImportance] = useState(0);
    const [industryJobs1000Importance, setIndustryJobs1000Importance] = useState(0);
    let responseData = [];
    const navigate = useNavigate();

    
    return <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Custom Search
        </h2>
        <p className="text-base text-gray-800 mb-8">
            Enter your desired values for the following parameters. Empty fields will be ignored.
        </p>

        {/* Custom Search Rows */}
        <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Median Home Price:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={medianHomePrice}
                        onChange={(e) => setMedianHomePrice(e.target.value) || 0}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={medianHomePriceImportance}
                        onChange={(e) => setMedianHomePriceImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{medianHomePriceImportance}</span>
                </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Crime Rate:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={crimeRate}
                        onChange={(e) => setCrimeRate(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={crimeRateImportance}
                        onChange={(e) => setCrimeRateImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{crimeRateImportance}</span>
                </div>
            </div>
            
            {/* Row 3 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Population:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={population}
                        onChange={(e) => setPopulation(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={populationImportance}
                        onChange={(e) => setPopulationImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{populationImportance}</span>
                </div>
            </div>

            {/* Row 4 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Population Density:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={populationDensity}
                        onChange={(e) => setPopulationDensity(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={populationDensityImportance}
                        onChange={(e) => setPopulationDensityImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{populationDensityImportance}</span>
                </div>
            </div>

            {/* Row 5 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Cost of Living
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={costOfLiving}
                        onChange={(e) => setCostOfLiving(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={costOfLivingImportance}
                        onChange={(e) => setCostOfLivingImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{costOfLivingImportance}</span>
                </div>
            </div>

            {/* Row 6 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Median Family Income:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={medianFamilyIncome}
                        onChange={(e) => setMedianFamilyIncome(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={medianFamilyIncomeImportance}
                        onChange={(e) => setMedianFamilyIncomeImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{medianFamilyIncomeImportance}</span>
                </div>
            </div>

            {/* Row 7 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Natural Disaster Count
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={naturalDisasterCount}
                        onChange={(e) => setNaturalDisasterCount(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={naturalDisasterCountImportance}
                        onChange={(e) => setNaturalDisasterCountImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{naturalDisasterCountImportance}</span>
                </div>
            </div>

            {/* Row 8 */}
            <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <label htmlFor="latitude" className="text-gray-700 font-medium w-48">
                            Latitude:
                        </label>
                        <input
                            type="text"
                            id="latitude"
                            className="border border-gray-300 rounded px-2 py-1 w-24 mr-14"
                            placeholder="Value"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                        <label htmlFor="longitude" className="text-gray-700 font-medium w-40">
                            Longitude:
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="text"
                            id="longitude"
                            className="border border-gray-300 rounded px-2 py-1 w-24 mr-0"
                            placeholder="Value"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                        <input
                            type="range"
                            className="ml-4"
                            style={{ width: "200px" }}
                            min="0"
                            max="100"
                            value={locationImportance}
                            onChange={(e) => setLocationImportance(Number(e.target.value))}
                        />
                        <span className="ml-2">{locationImportance}</span>
                    </div>
                </div>

            {/* Row 9 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <select
                        id="industry"
                        className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-700 mr-7"
                        style={{ width: "290px" }}
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                    >
                    {jobs.map((job) => (
                        <option key={job} value={job}>
                            {job}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <label htmlFor="salary" className="text-gray-700 font-medium mr-24">
                        Salary:
                    </label>
                    <input
                        type="text"
                        id="salary"
                        className="border border-gray-300 rounded px-3 py-1 flex-grow"
                        placeholder="value"
                        style={{ width: "98px" }}
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={salaryImportance}
                        onChange={(e) => setSalaryImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{salaryImportance}</span>
                </div>
            </div>

            {/* Row 10 */}
            <div className="flex items-center justify-end">
                <label htmlFor="salary" className="text-gray-700 font-medium mr-24">
                    Jobs 1000:
                </label>
                <input
                    type="text"
                    id="jobs1000"
                    className="border border-gray-300 rounded px-2 py-1"
                    placeholder="value"
                    style={{ width: "98px" }}
                    value={industryJobs1000}
                    onChange={(e) => setIndustryJobs1000(e.target.value)}
                />
                <input
                    type="range"
                    className="ml-4"
                    style={{ width: "200px" }}
                    min="0"
                    max="100"
                    value={industryJobs1000Importance}
                    onChange={(e) => setIndustryJobs1000Importance(Number(e.target.value))}
                />
                <span className="ml-2">{industryJobs1000Importance}</span>
            </div>
        </div>
        <div className="flex justify-center mt-8">
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
                // Handle button click
                if(industry === "Select An Industry" || industry === ""){
                    alert("Please select an industry");
                    return;
                }
                console.log("Button clicked");
                const searchParams = {
                    "preferred_median_home_price": parseInt(medianHomePrice) || 0,
                    "preferred_crime_rate": parseInt(crimeRate) || 0,
                    "preferred_population": parseInt(population) || 0,
                    "preferred_population_density": parseInt(populationDensity) || 0,
                    "preferred_cost_of_living": parseInt(costOfLiving) || 0,
                    "preferred_median_family_income": parseInt(medianFamilyIncome) || 0,
                    "preferred_natural_disaster_count": parseInt(naturalDisasterCount) || 0,
                    "preferred_latitude": parseInt(latitude) || 0,
                    "preferred_longitude": parseInt(longitude) || 0,
                    "industry_name": industry, // Assuming `industry` is a string
                    "preferred_industry_salary": parseInt(salary) || 0,
                    "preferred_industry_jobs_1000": parseInt(industryJobs1000) || 0,
                    "importance_median_home_price": parseInt(medianHomePriceImportance) || 0,
                    "importance_crime_rate": parseInt(crimeRateImportance) || 0,
                    "importance_population": parseInt(populationImportance) || 0,
                    "importance_population_density": parseInt(populationDensityImportance) || 0,
                    "importance_cost_of_living": parseInt(costOfLivingImportance) || 0,
                    "importance_median_family_income": parseInt(medianFamilyIncomeImportance) || 0,
                    "importance_natural_disaster_count": parseInt(naturalDisasterCountImportance) || 0,
                    "importance_location": parseInt(locationImportance) || 0,
                    "importance_industry_salary": parseInt(salaryImportance) || 0,
                    "importance_industry_jobs_1000": parseInt(industryJobs1000Importance) || 0,
                };
            console.log(searchParams);
            api.post("/api/neighborhoods/preference-ranking/", searchParams)
                .then((response) => {
                    console.log("Search results:", response.data);
                    responseData = response.data;
                    console.log(responseData);
                    // Redirect to the list page
                    navigate("/list", { state: { data: responseData } });
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
}

export default CustomSearch