/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ActivePolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/polls')
      .then(res => setPolls(res.data))
      .catch(err => console.error('Error fetching polls:', err));
  }, []);

  return (
    <div>
      <h2>🗳️ Active Public Polls</h2>
      {polls.map(poll => (
        <div key={poll.id} style={{ marginBottom: '20px' }}>
          <h3>{poll.question}</h3>
          <Link to={`/poll/${poll.id}`} style={{ marginRight: '10px' }}>Vote</Link>
          <Link to={`/poll/${poll.id}/results`}>View Results</Link>
        </div>
      ))}
    </div>
  );
};

export default ActivePolls;
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../polls.css';

const ActivePolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/polls')
      .then(res => setPolls(res.data))
      .catch(err => console.error('Error fetching polls:', err));
  }, []);

  const colors = ['poll-button-blue', 'poll-button-purple', 'poll-button-pink'];

  return (
    <div className="poll-container">
      <div className="poll-section-title">
        <h2 className="poll-heading">🗳️ Active Public Polls</h2>
        <p className="poll-description">Browse the currently open polls and vote now.</p>
      </div>

      <div className="poll-grid">
        {polls.map((poll, index) => {
          const buttonColor = colors[index % colors.length];

          return (
            <div key={poll.id} className={`poll-button ${buttonColor}`}>
              <div className="poll-button-background"></div>
              <div className="poll-button-content">
                <div className="poll-button-icon">🗳️</div>
                <h3 className="poll-button-title">{poll.question}</h3>
                <p className="poll-button-description">
                  <Link to={`/poll/${poll.id}`} style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline', marginRight: '10px' }}>
                    Vote
                  </Link>
                  <Link to={`/poll/${poll.id}/results`} style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}>
                    Results
                  </Link>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivePolls;
