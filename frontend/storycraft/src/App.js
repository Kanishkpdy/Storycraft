import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReadStory from './ReadStory';
import Home from './Home';
import Upload from './Upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<ReadStory />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
