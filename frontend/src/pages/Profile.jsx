import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    location: "",
    bio: "",
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
    <div className="bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Profile Content */}
      <div
        className="p-8 flex justify-center items-center"
        style={{ height: contentHeight }}
      >
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-medium text-gray-900">{userData.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-medium text-gray-900">
                {userData.location || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bio</p>
              <p className="text-lg font-medium text-gray-900">
                {userData.bio || "No bio available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;