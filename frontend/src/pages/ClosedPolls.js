import React, { useEffect, useState } from 'react';
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