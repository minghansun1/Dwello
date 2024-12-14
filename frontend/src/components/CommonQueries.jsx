import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { jobs } from "../constants"

function CommonQueries(){
    const navigate = useNavigate()

    return <div>
        <div>
            {/* Grid Section */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                Commonly Searched
                </h1>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/neighborhoods/price-ranking/")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        Neighborhood Price Ranking
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/cities/price-ranking/")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        City Price Rankings
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/cities/high-cost/")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        High Cost Cities
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/states/natural-disasters/")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        Natural Disasters Per State
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 5")}
                    >
                        Nearest City (Requires input)
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/top-liked-locations/?type=city")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        Most Liked Cities
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/top-liked-locations/?type=state")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        Most Liked States
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/top-liked-locations/?type=neighborhood")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        Most Liked Neighborhoods
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            api.get("/api/top-liked-locations/?type=zipcode")
                                .then((response) => {
                                    console.log("Search results:", response.data);
                                    const responseData = response.data;
                                    console.log(responseData);
                                    navigate("/list", { state: { data: responseData } });
                                })
                                .catch((error) => {
                                    console.error("There was an error searching!", error);
                                    alert("Search failed. Please try again.");
                                });
                        }}
                    >
                        Most Liked Zip Codes
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => {
                            // Handle button click
                            const searchParams = {
                                "preferred_median_home_price": Math.floor(Math.random() * 10000000), // Random price between 0 and 1,000,000
                                "preferred_crime_rate": (Math.random()*200).toFixed(100), // Random crime rate between 0 and 1 (2 decimal places)
                                "preferred_population": Math.floor(Math.random() * 10000000), // Random population between 0 and 10 million
                                "preferred_population_density": Math.floor(Math.random() * 10000), // Random density between 0 and 10,000
                                "preferred_cost_of_living": Math.floor(Math.random() * 1000000), // Random cost of living between 0 and 100,000
                                "preferred_median_family_income": Math.floor(Math.random() * 500000), // Random income between 0 and 200,000
                                "preferred_natural_disaster_count": Math.floor(Math.random() * 50), // Random count between 0 and 100
                                "preferred_latitude": (Math.random() * 180 - 90).toFixed(6), // Random latitude between -90 and 90
                                "preferred_longitude": (Math.random() * 360 - 180).toFixed(6), // Random longitude between -180 and 180
                                "industry_name": jobs[Math.floor(Math.random()*(jobs.length))], // Random industry name
                                "preferred_industry_salary": Math.floor(Math.random() * 500000), // Random salary between 0 and 500,000
                                "preferred_industry_jobs_1000": Math.floor(Math.random() * 100), // Random jobs count between 0 and 1,000
                                "importance_median_home_price": Math.floor(Math.random() * 100), // Random importance between 0 and 10
                                "importance_crime_rate": Math.floor(Math.random() * 100),
                                "importance_population": Math.floor(Math.random() * 100),
                                "importance_population_density": Math.floor(Math.random() * 100),
                                "importance_cost_of_living": Math.floor(Math.random() * 100),
                                "importance_median_family_income": Math.floor(Math.random() * 100),
                                "importance_natural_disaster_count": Math.floor(Math.random() * 100),
                                "importance_location": Math.floor(Math.random() * 100),
                                "importance_industry_salary": Math.floor(Math.random() * 100),
                                "importance_industry_jobs_1000": Math.floor(Math.random() * 100),
                            };
                        console.log(searchParams);
                        api.post("/api/neighborhoods/preference-ranking/", searchParams)
                            .then((response) => {
                                console.log("Search results:", response.data);
                                const responseData = response.data;
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
                        Random Search Parameters
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 11")}
                    >
                        States with Most Natural Disasters
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 12")}
                    >
                        States with Least Natural Disasters
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 13")}
                    >
                        Counties with Highest Cost of Living
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 14")}
                    >
                        Counties with Lowest Cost of Living
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 15")}
                    >
                        Random Search Parameters
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default CommonQueries