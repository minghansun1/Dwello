import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import './styles/tailwind.css'
import Home from "./pages/Home"
import Search from "./pages/Search"
import List from "./pages/List"
import Detailed from "./pages/Detailed"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"


function Logout() {
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
          },
          body: JSON.stringify({
            refresh_token: localStorage.getItem(REFRESH_TOKEN)
          })
        });
        
        if (response.ok) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    logout();
  }, []);

  return null;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/list" element={<List />} />
        <Route path="/detailed" element={<Detailed />} />
        <Route path="/about" element={<About />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/logout" element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
          } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
