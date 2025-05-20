/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClosedPolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/polls/closed')
      .then(res => setPolls(res.data))
      .catch(err => console.error('Error fetching closed polls:', err));
  }, []);

  return (
    <div>
      <h2>📊 Closed Polls</h2>
      {polls.length === 0 ? (
        <p>No closed polls yet.</p>
      ) : (
        polls.map(poll => (
          <div key={poll.id} style={{ marginBottom: '20px' }}>
            <h3>{poll.question}</h3>
            <Link to={`/poll/${poll.id}/results`}>View Results</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default ClosedPolls;
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../polls.css';

const ClosedPolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/polls/closed')
      .then(res => setPolls(res.data))
      .catch(err => console.error('Error fetching closed polls:', err));
  }, []);

  return (
    <div className="poll-page">
      <main className="poll-main">
        <div className="poll-container">
          <div className="poll-section-title">
            <h2 className="poll-heading">📊 Closed Polls</h2>
            <p className="poll-description">These polls have ended. View their results below.</p>
          </div>

          {polls.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'white' }}>No closed polls yet.</p>
          ) : (
            <div className="poll-grid" style={{ justifyContent: 'center' }}>
              {polls.map(poll => (
                <div
                  key={poll.id}
                  className="poll-button poll-button-purple"
                  style={{
                    maxWidth: '600px',
                    width: '100%',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="poll-button-background"></div>
                  <div className="poll-button-content" style={{ zIndex: 1 }}>
                    <h3 style={{ color: 'white' }}>{poll.question}</h3>
                    <Link
                      to={`/poll/${poll.id}/results`}
                      className="poll-cta-button"
                      style={{ marginTop: '1rem' }}
                    >
                       View Results
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClosedPolls;

