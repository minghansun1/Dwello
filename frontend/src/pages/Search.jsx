import React from "react";
import Navbar from "../components/Navbar";
import CommonQueries from "../components/CommonQueries";
import CustomSearch from "../components/CustomSearch";
import CustomFilter from "../components/CustomFilter";

const SearchPage = () => {
  const handleButtonClick = (buttonText) => {
    console.log(`Button ${buttonText} clicked!`);
  };

  return (
    <div className="pt-16">
        <Navbar/>
        <div className="min-h-screen bg-gray-100 p-6">
            <CommonQueries/>
            <CustomSearch/>
            <CustomFilter/>
        </div>
    </div>
    
  );
};

export default SearchPage;