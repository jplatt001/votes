/*import React, { useEffect, useState, useCallback } from 'react';
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
*/
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../polls.css';

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
            setPasswordError('Incorrect password');
          }
          setPoll(null);
        } else {
          console.error('Error fetching poll:', err);
        }
      })
      .finally(() => setLoading(false));
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const handleOptionChange = (optionId) => {
    if (!poll) return;
    if (poll.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option');
      return;
    }

    setLoading(true);

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
      })
      .finally(() => setLoading(false));
  };

  const handlePasswordSubmit = () => {
    fetchPoll(password);
  };

  if (loading && !poll) return <p>Loading poll...</p>;

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

  if (!poll) return <p>Loading poll...</p>;

  if (voted) {
    return (
      <div className="poll-page">
        <main className="poll-main">
          <div className="poll-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>✅ Thank you for voting!</h2>
            <Link to={`/poll/${pollId}/results`} className="poll-cta-button" style={{ marginTop: '1rem', display: 'inline-block' }}>
              📊 View Results
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="poll-page">
      <main className="poll-main">
        <div className="poll-container">
          <div className="poll-section-title">
            <h2 className="poll-heading">🗳️ {poll.question}</h2>
            <p className="poll-description">Select your option{poll.type === 'multiple' ? 's' : ''} and cast your vote.</p>
          </div>

          <div className="poll-grid" style={{ justifyContent: 'center' }}>
            <div
              className="poll-button poll-button-blue"
              style={{
                maxWidth: '650px',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box'
              }}
            >
              <div className="poll-button-background"></div>
              <div className="poll-button-content" style={{ width: '100%' }}>
                {poll.options && poll.options.length > 0 ? (
                  poll.options.map(opt => (
                    <div key={opt.id} style={{ marginBottom: '1rem' }}>
                      <label style={{ color: 'white', fontWeight: 'bold' }}>
                        <input
                          type={poll.type === 'single' ? 'radio' : 'checkbox'}
                          name="pollOption"
                          value={opt.id}
                          checked={selectedOptions.includes(opt.id)}
                          onChange={() => handleOptionChange(opt.id)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {opt.option_text}
                      </label>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'white' }}>No options available for this poll.</p>
                )}

                <button
                  className="poll-cta-button"
                  onClick={handleVote}
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
                >
                  {loading ? 'Submitting...' : 'Submit Vote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VotePage;
