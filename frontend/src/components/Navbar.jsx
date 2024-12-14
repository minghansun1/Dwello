import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import {jwtDecode} from "jwt-decode"
import api from "../api"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthenticated(false))
    }, [])

    const refreshToken = async () => {
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            })
            if (res.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthenticated(true)
                console.log("Authenticated")
            } else {
                setIsAuthenticated(false)
                console.log("Not authenticated")
            }
        } catch (error) {
            console.log(error)
            setIsAuthenticated(false)
            console.log("Not authenticated")
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthenticated(false)
            console.log("Not authenticated")
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / "1000"

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthenticated(true)
            console.log("Authenticated")
        }
    }

  const handleOutsideClick = (e) => {
    if (
      !e.target.closest(".hamburger-menu") &&
      !e.target.closest(".hamburger-btn")
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold hover:text-gray-300">
          Dwello
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hamburger-btn text-white hover:text-gray-300 md:hidden"
        >
          ☰
        </button>

        {/* Desktop Navigation Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Map
            </Link>
          </li>
          <li>
            <Link to="/search" className="hover:text-gray-300">
              Search
            </Link>
          </li>
          <li>
            <Link to="/about/" className="hover:text-gray-300">
              About
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" className="hover:text-gray-300">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/logout" className="hover:text-gray-300">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={`hamburger-menu fixed top-0 right-0 h-full bg-gray-900 text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-20 w-64 md:hidden`}
      >
        <li className="p-4 border-b border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300"
          >
            ✕ Close
          </button>
        </li>
        <li className="p-4 border-b border-gray-700">
          <Link
            to="/"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Map
          </Link>
        </li>
        <li className="p-4 border-b border-gray-700">
          <Link
            to="/search"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Search
          </Link>
        </li>
        <li className="p-4 border-b border-gray-700">
          <Link
            to="/about/"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className="p-4 border-b border-gray-700">
              <Link
                to="/profile"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li className="p-4">
              <Link
                to="/logout"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="p-4 border-b border-gray-700">
              <Link
                to="/login"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </li>
            <li className="p-4">
              <Link
                to="/register"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;