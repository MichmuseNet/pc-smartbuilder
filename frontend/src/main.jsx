import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home.jsx'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'
import Dashboard from './views/Dashboard.jsx'
import Recommendation from './views/Recommendation.jsx'
import Compatibility from './views/Compatibility.jsx'
import Diagnostics from './views/Diagnostics.jsx'
import History from './views/History.jsx'
//Monta React, define todas las rutas de la aplicación utilizando React Router, incluyendo rutas para Home, Login, Register, Dashboard, Recommendation, Compatibility, Diagnostics y History, y renderiza la aplicación en el elemento con id 'root' del DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/compatibility" element={<Compatibility />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)