import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import SalaatTimes from './pages/SalaatTimes.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/alihsaan-web">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/salaat" element={<SalaatTimes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
