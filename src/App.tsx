import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationHeader from './components/NavigationHeader';
import LandingPage from './pages/LandingPage';
import ReturnFormPage from './pages/ReturnFormPage';
import AIDecisionPage from './pages/AIDecisionPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/return-form" element={<ReturnFormPage />} />
          <Route path="/ai-decision" element={<AIDecisionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;