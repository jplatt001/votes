import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VotePage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchPoll = useCallback((pwd) => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/polls/${pollId}`, {
      headers: pwd ? { 'x-poll-password': pwd } : {}
    })
      .then(res => {
        setPoll(res.data);
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
          setPoll(null);
        } else {
          console.error('Error fetching poll:', err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const handleOptionChange = (optionId) => {
    if (!poll) return;
    if (poll.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option');
      return;
    }

    axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, {
      optionIds: selectedOptions
    }, {
      headers: password ? { 'x-poll-password': password } : {}
    })
      .then(() => {
        setVoted(true);
      })
      .catch(err => {
        alert('Failed to submit vote');
        console.error(err);
      });
  };

  const handlePasswordSubmit = () => {
    fetchPoll(password);
  };

  if (loading) return <p>Loading...</p>;

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

  if (!poll) return <p>Loading poll...</p>;

  if (voted) return (
    <div>
      <h2>Thank you for voting!</h2>
      <Link to={`/poll/${pollId}/results`}>View Results</Link>
    </div>
  );

  return (
    <div>
      <h2>{poll.question}</h2>
      <form>
        {poll.options.map(opt => (
          <div key={opt.id}>
            <label>
              <input
                type={poll.type === 'single' ? 'radio' : 'checkbox'}
                name="pollOption"
                value={opt.id}
                checked={selectedOptions.includes(opt.id)}
                onChange={() => handleOptionChange(opt.id)}
              />
              {opt.option_text}
            </label>
          </div>
        ))}
      </form>
      <button onClick={handleVote}>Vote</button>
    </div>
  );
};

export default VotePage;
