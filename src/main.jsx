import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import SalaatTimes from './pages/SalaatTimes.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/salaat" element={<SalaatTimes />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
