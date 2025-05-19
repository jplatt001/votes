import React, { useEffect, useState, useCallback } from 'react';
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
