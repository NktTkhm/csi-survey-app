import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Компоненты
import UserSelection from './components/UserSelection';
import ProjectSelection from './components/ProjectSelection';
import Survey from './components/Survey';
import AdminPanel from './components/AdminPanel';
import SurveyComplete from './components/SurveyComplete';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={<UserSelection />} />
          <Route path="/user/:userId/projects" element={<ProjectSelection />} />
          <Route path="/survey/:userId/:projectId" element={<Survey />} />
          <Route path="/complete" element={<SurveyComplete />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
