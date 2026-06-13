import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#212529', marginBottom: '30px' }}>Shared Expenses System</h1>
        
        <Routes>
          {/* Default route links to Login page */}
          <Route path="/" element={<Login />} />
          
          {/* Application dashboard for expense analytics */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Fallback routing mechanism */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;