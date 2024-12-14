import Navbar from "../components/Navbar"

function CommonQueries(){
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
                        onClick={() => handleButtonClick("Option 1")}
                    >
                        Neighborhoods for You
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 2")}
                    >
                        Most Liked Neighborhoods
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 3")}
                    >
                        Highest Priced Neighborhoods
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 4")}
                    >
                        Lowest Priced Neighborhoods
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 5")}
                    >
                        Highest Priced Cities
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 6")}
                    >
                        Lowest Priced Cities
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 7")}
                    >
                        Cities with Most Crime
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 8")}
                    >
                        Cities with Least Crime
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 9")}
                    >
                        Cities with Highest Population Density
                    </button>
                    <button
                        className="bg-blue-500 text-white font-medium py-3 rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={() => handleButtonClick("Option 10")}
                    >
                        Cities with Lowest Population Density
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