import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    localStorage.clear()
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    api.post("/api/users/login/", { "username": username, "password": password })
        .then((response) => {
            console.log("Login successful:", response.data);
            localStorage.setItem(ACCESS_TOKEN, response.data.tokens.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.tokens.refresh);
            navigate("/profile")
        })
        .catch((error) => {
            console.error("There was an error logging in!", error);
            alert("Login failed. Please try again.");
        });
  };

  return (
    <div className="pt-16">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Login
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
                        id="username"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </div>
                </form>
                <p className="mt-6 text-sm text-gray-600 text-center">
                    Don't have an account?{" "}
                <a href="/register" className="text-indigo-500 hover:underline">
                    Register
                </a>
                </p>
            </div>
        </div>
    </div>);
};

export default Login;