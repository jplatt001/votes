import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ActivePolls from './pages/ActivePolls';
import CreatePoll from './pages/CreatePoll';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>🗳️ Active Polls</Link>
          <Link to="/create">➕ Create Poll</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ActivePolls />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:pollId" element={<VotePage />} />
          <Route path="/poll/:pollId/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
