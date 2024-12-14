import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profile: {
      income: "",
      city: {},
      liked_neighborhoods: [],
      liked_cities: [],
      liked_states: [],
      liked_zipcodes: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentHeight, setContentHeight] = useState("100vh");
  const navigate = useNavigate();

  // Adjust content height based on navbar height
  useEffect(() => {
    const updateHeight = () => {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 64;
      setContentHeight(`calc(100vh - ${navbarHeight}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/users/get_user_profile/");
        console.log("User data:", response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 pt-16">
      {/* Navbar */}
      <Navbar />
      <div className="p-8" style={{ minHeight: contentHeight }}>
        <div className="max-w-4xl mx-auto">
          {/* Basic Info Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-medium text-gray-900">{userData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium text-gray-900">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Income</p>
                <p className="text-lg font-medium text-gray-900">
                  ${Number(userData.profile?.income).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current City</p>
                <p className="text-lg font-medium text-gray-900">
                  {userData.profile?.city?.name ? 
                    `${userData.profile.city.name}, ${userData.profile.city.state_id}` : 
                    'None, None'}
                </p>
              </div>
            </div>
          </div>

          {/* Liked Locations Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liked States & Cities */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Liked States</h2>
              <ul className="space-y-2">
                {userData.profile?.liked_states.map((state, index) => (
                  <li key={index} className="text-gray-700">{state.location_name}</li>
                ))}
              </ul>
              
              <h2 className="text-xl font-semibold mb-4 mt-6">Liked Cities</h2>
              <ul className="space-y-2">
                {userData.profile?.liked_cities.map((city, index) => (
                  <li key={index} className="text-gray-700">{city.location_name}</li>
                ))}
              </ul>
            </div>

            {/* Liked Neighborhoods & Zip Codes */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Liked Neighborhoods</h2>
              <ul className="space-y-2">
                {userData.profile?.liked_neighborhoods.map((neighborhood, index) => (
                  <li key={index} className="text-gray-700">{neighborhood.location_name}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold mb-4 mt-6">Liked Zip Codes</h2>
              <ul className="space-y-2">
                {userData.profile?.liked_zipcodes.map((zip, index) => (
                  <li key={index} className="text-gray-700">
                    {zip.zip_code} - {zip.city_name}, {zip.state_id}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;