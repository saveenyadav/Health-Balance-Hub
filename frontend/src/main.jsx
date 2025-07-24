// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './styles/index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // ✅ Make sure this path is correct

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Wrap App in AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);