import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          Dwello
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-gray-300 md:hidden"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex space-y-4 md:space-y-0 md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-gray-800 md:bg-transparent z-10`}
        >
          <li>
            <Link to="/" className="block px-4 py-2 md:p-0 hover:text-gray-300">
              Homepage
            </Link>
          </li>
          <li>
            <Link to="/about/" className="block px-4 py-2 md:p-0 hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/login" className="block px-4 py-2 md:p-0 hover:text-gray-300">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="block px-4 py-2 md:p-0 hover:text-gray-300">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;