// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WriteStory from './pages/WriteStory';
import ReadStory from './pages/ReadStory';
import Header from './Header';
import { getToken } from './auth';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<ReadStory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={getToken() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/write/:id?"
          element={getToken() ? <WriteStory /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
