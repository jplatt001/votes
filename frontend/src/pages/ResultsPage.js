/*import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState(null);
  const [poll, setPoll] = useState(null);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchResults = useCallback((pwd) => {
    axios.get(`http://localhost:5000/api/polls/${pollId}/results`, {
      headers: pwd ? { 'x-poll-password': pwd } : {}
    })
      .then(res => {
        setResults(res.data);
        setPasswordPrompt(false);
        setPasswordError('');
      })
      .catch(err => {
        if (err.response) {
          setPasswordPrompt(true);
          if (err.response.status === 401) {
            setPasswordError('Password required');
          } else {
            setPasswordError('incorrect password.');
          }
          setResults(null);
        } else {
          console.error('Error fetching results:', err);
        }
      });
  }, [pollId]);

  const fetchPollDetails = useCallback((pwd) => {
    axios.get(`http://localhost:5000/api/polls/${pollId}`, {
      headers: pwd ? { 'x-poll-password': pwd } : {}
    })
      .then(res => setPoll(res.data))
      .catch(err => console.error('Error fetching poll:', err));
  }, [pollId]);

  useEffect(() => {
    fetchResults();
    fetchPollDetails();
  }, [fetchResults, fetchPollDetails]);

  const handlePasswordSubmit = () => {
    fetchResults(password);
    fetchPollDetails(password);
  };

  if (passwordPrompt) {
    return (
      <div>
        <h3>This poll is private. Please enter password:</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handlePasswordSubmit}>Submit</button>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      </div>
    );
  }

  if (!results || !poll) return <p>Loading results...</p>;

  return (
    <div>
      <h2>Results for: {poll.question}</h2>
      <ul>
        {results.map(r => (
          <li key={r.option_id}>
            {r.option_text}: {r.vote_count} vote{r.vote_count !== 1 ? 's' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
*/
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../polls.css';

const ResultsPage = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState(null);
  const [poll, setPoll] = useState(null);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchResults = useCallback((pwd) => {
    axios.get(`http://localhost:5000/api/polls/${pollId}/results`, {
      headers: pwd ? { 'x-poll-password': pwd } : {}
    })
      .then(res => {
        setResults(res.data);
        setPasswordPrompt(false);
        setPasswordError('');
      })
      .catch(err => {
        if (err.response) {
          setPasswordPrompt(true);
          if (err.response.status === 401) {
            setPasswordError('Password required');
          } else {
            setPasswordError('Incorrect password');
          }
          setResults(null);
        } else {
          console.error('Error fetching results:', err);
        }
      });
  }, [pollId]);

  const fetchPollDetails = useCallback((pwd) => {
    axios.get(`http://localhost:5000/api/polls/${pollId}`, {
      headers: pwd ? { 'x-poll-password': pwd } : {}
    })
      .then(res => setPoll(res.data))
      .catch(err => console.error('Error fetching poll:', err));
  }, [pollId]);

  useEffect(() => {
    fetchResults();
    fetchPollDetails();
  }, [fetchResults, fetchPollDetails]);

  const handlePasswordSubmit = () => {
    fetchResults(password);
    fetchPollDetails(password);
  };

  if (passwordPrompt) {
    return (
      <div className="poll-page">
        <main className="poll-main">
          <div className="poll-container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '1rem' }}>🔒 This poll is private. Please enter the password:</h3>
            <input
              type="password"
              className="poll-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="poll-cta-button" style={{ marginTop: '1rem' }} onClick={handlePasswordSubmit}>Submit</button>
            {passwordError && <p style={{ color: 'red', marginTop: '0.5rem' }}>{passwordError}</p>}
          </div>
        </main>
      </div>
    );
  }

  if (!results || !poll) return <p>Loading results...</p>;

  return (
    <div className="poll-page">
      <header className="poll-header">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 className="poll-title">PollWise System</h1>
        </div>
      </header>

      <main className="poll-main">
        <div className="poll-container">
          <div className="poll-section-title">
            <h2 className="poll-heading">📊 Poll Results</h2>
            <p className="poll-description">Results for: <strong>{poll.question}</strong></p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {results.map(opt => (
              <div
                key={opt.option_id}
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: '#f9f9f9',
                  borderRadius: '8px'
                }}
              >
                <strong style={{ fontSize: '1.1rem', color: '#4f46e5' }}>{opt.option_text}</strong>
                <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                  {opt.vote_count} vote{opt.vote_count !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="poll-footer">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }} />
      </footer>
    </div>
  );
};

export default ResultsPage;
