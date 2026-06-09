import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// ============================================
// APP ENTRY POINT
// ============================================
// This is the first file that runs when the app loads
// It mounts our React App into the HTML root div

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables routing (URLs like /tickets/TKT-001) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)