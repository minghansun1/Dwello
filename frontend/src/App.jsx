import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
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

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
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
