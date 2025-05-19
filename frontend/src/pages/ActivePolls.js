import React, { useEffect, useState } from 'react';
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