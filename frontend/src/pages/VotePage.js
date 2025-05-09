import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VotePage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/polls/${pollId}`)
      .then(res => {
        setPoll(res.data);
      })
      .catch(err => console.error('Error fetching poll:', err));
  }, [pollId]);

  const handleVote = () => {
    if (!selectedOption) {
      return alert("Select an option first.");
    }

    setLoading(true); // Start loading

    axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, { optionId: selectedOption })
      .then(() => {
        setVoted(true);
        setLoading(false); // Stop loading
        alert('Vote recorded!');
      })
      .catch(err => {
        console.error('Voting failed:', err);
        alert('Voting failed. Please try again.');
        setLoading(false); // Stop loading even on error
      });
  };

  if (!poll) return <p>Loading poll...</p>;

  return (
    <div>
      <h2>{poll.question}</h2>
      {poll.options && poll.options.length > 0 ? (
        poll.options.map(opt => (
          <div key={opt.id}>
            <input
              type="radio"
              name="option"
              value={opt.id}
              onChange={() => setSelectedOption(opt.id)}
            />
            {opt.option_text}
          </div>
        ))
      ) : (
        <p>No options available for this poll.</p>
      )}

      <button onClick={handleVote} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Vote'}
      </button>

      {voted && (
        <div style={{ marginTop: '20px' }}>
          {/* No redirect, just show the results link */}
          <Link to={`/poll/${pollId}/results`}>View Results</Link>
        </div>
      )}
    </div>
  );
};

export default VotePage;
