// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WriteStory from './pages/WriteStory';
import ReadStory from './pages/ReadStory';
import Profile from './pages/Profile';
import Header from './Header';
import { getToken, getUser } from './auth';
import './styles.css';

function App() {
  const user = getUser();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<ReadStory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route path="/dashboard" element={<Navigate to={`/profile/${user?.id}`} />} />

        <Route
          path="/write/:id?"
          element={getToken() ? <WriteStory /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
