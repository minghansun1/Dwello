import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Form Data Submitted:", formData);

    api.post("/api/auth/signup/", formData)
        .then((response) => {
            console.log("Registration successful:", response.data);
            window.location.href = "/login";
        })
        .catch((error) => {
            console.error("There was an error registering!", error);
            alert("Registration failed. Please try again.");
        });
  };

  return (
    <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Register
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                    >
                    Username
                    </label>
                    <input
                    type="text"
                    id="name"
                    name="username"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                    >
                    Email Address
                    </label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                    >
                    Password
                    </label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                    >
                    Confirm Password
                    </label>
                    <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                    Register
                    </button>
                </div>
                </form>
                <p className="mt-6 text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <a href="/login" className="text-indigo-500 hover:underline">
                    Login
                </a>
                </p>
            </div>
        </div>
    </div>
    
  );
};

export default Register;