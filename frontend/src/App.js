/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ActivePolls from './pages/ActivePolls';
import CreatePoll from './pages/CreatePoll';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import ClosedPolls from './pages/ClosedPolls';


function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>🗳️ Active Polls</Link>
          <Link to="/create">➕ Create Poll</Link>
          <Link to="/closed" style={{ marginLeft: '15px' }}>📁 Closed Polls</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ActivePolls />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:pollId" element={<VotePage />} />
          <Route path="/poll/:pollId/results" element={<ResultsPage />} />
          <Route path="/closed" element={<ClosedPolls />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ActivePolls from './pages/ActivePolls';
import CreatePoll from './pages/CreatePoll';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import ClosedPolls from './pages/ClosedPolls';
import './polls.css';

function App() {
  return (
    <Router>
      <div className="poll-page">
        <header className="poll-header">
          <nav className="poll-nav">
            <Link to="/">🗳️ Active Polls</Link>
            <Link to="/create">➕ Create Poll</Link>
            <Link to="/closed">🔒 Closed Polls</Link>
          </nav>
        </header>

        <main className="poll-main">
          <div className="poll-container">
            <Routes>
              <Route path="/" element={<ActivePolls />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:pollId" element={<VotePage />} />
              <Route path="/poll/:pollId/results" element={<ResultsPage />} />
              <Route path="/closed" element={<ClosedPolls />} />
            </Routes>
          </div>
        </main>

        <footer className="poll-footer">
          © {new Date().getFullYear()} My Poll App
        </footer>
      </div>
    </Router>
  );
}

export default App;
