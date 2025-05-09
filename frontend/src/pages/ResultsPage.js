import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/polls/${pollId}/results`)
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching results:', err);
        setLoading(false);
      });
  }, [pollId]);

  if (loading) return <p>Loading results...</p>;

  return (
    <div>
      <h2>Poll Results</h2>
      {results.map(opt => (
        <div key={opt.option_id}>
          <p>
            <strong>{opt.option_text}</strong>: {opt.vote_count} vote(s)
          </p>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
