/*import React, { useState } from 'react';
import axios from 'axios';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('single');
  const [password, setPassword] = useState('');

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async () => {
    if (!isPublic && password.trim() === '') {
      alert('Password is required for private polls');
      return;
    }

    try {
      const payload = {
        question,
        options: options.filter(opt => opt.trim() !== ''),
        isPublic,
        startTime,
        endTime,
        type,
        password: isPublic ? undefined : password,
      };

      await axios.post('http://localhost:5000/api/polls', payload);
      alert('Poll created!');
      setQuestion('');
      setOptions(['', '']);
      setIsPublic(true);
      setStartTime('');
      setEndTime('');
      setType('single');
      setPassword('');
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div>
      <h2>Create Poll</h2>

      <input
        type="text"
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />

      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(e.target.value, index)}
        />
      ))}
      <br />

      <button onClick={handleAddOption}>Add Option</button>
      <br /><br />

      <label>
        Public Poll:
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
      </label>
      <br />

      {!isPublic && (
        <>
          <label>
            Password for Private Poll:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
        </>
      )}

      <label>
        Question Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
        </select>
      </label>
      <br />

      <label>
        Start Time:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <br />

      <label>
        End Time:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <br />

      <button onClick={handleSubmit}>Submit Poll</button>
    </div>
  );
};

export default CreatePoll;
*/
import React, { useState } from 'react';
import axios from 'axios';
import '../polls.css';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('single');
  const [password, setPassword] = useState('');

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async () => {
    if (!isPublic && password.trim() === '') {
      alert('Password is required for private polls');
      return;
    }

    try {
      const payload = {
        question,
        options: options.filter(opt => opt.trim() !== ''),
        isPublic,
        startTime,
        endTime,
        type,
        password: isPublic ? undefined : password,
      };

      await axios.post('http://localhost:5000/api/polls', payload);
      alert('Poll created!');
      setQuestion('');
      setOptions(['', '']);
      setIsPublic(true);
      setStartTime('');
      setEndTime('');
      setType('single');
      setPassword('');
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

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
            <h2 className="poll-heading">📋 Create a New Poll</h2>
            <p className="poll-description">Customize your poll settings and start collecting votes!</p>
          </div>

          <div className="poll-grid" style={{ justifyContent: 'center' }}>
            <div
              className="poll-button poll-button-purple"
              style={{
                maxWidth: '650px',
                width: '100%',
                padding: '2rem',
                position: 'relative',
              }}
            >
              <div className="poll-button-background"></div>
              <div className="poll-button-content" style={{ padding: 0, width: '100%' }}>
                {/* Poll Question */}
                <input
                  type="text"
                  className="poll-input"
                  placeholder="Poll question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                {/* Poll Options */}
                {options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    className="poll-input"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e.target.value, index)}
                  />
                ))}

                <button className="poll-cta-button" onClick={handleAddOption}>
                  ➕ Add Option
                </button>

                {/* Question Type */}
                <label style={{ color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
                  Question Type:
                  <select
                    className="poll-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                  </select>
                </label>

                {/* Start Time */}
                <label style={{ color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
                  Start Time:
                  <input
                    type="datetime-local"
                    className="poll-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ marginTop: '0.5rem' }}
                  />
                </label>

                {/* End Time */}
                <label style={{ color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
                  End Time:
                  <input
                    type="datetime-local"
                    className="poll-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ marginTop: '0.5rem' }}
                  />
                </label>

                {/* Public/Private Toggle */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <label style={{ color: 'white', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Public Poll
                  </label>
                </div>

                {/* Password for Private Poll */}
                {!isPublic && (
                  <input
                    type="password"
                    className="poll-input"
                    placeholder="Password for private poll"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}

                <button
                  className="poll-cta-button"
                  onClick={handleSubmit}
                  style={{ marginTop: '1.5rem' }}
                >
                  ✅ Submit Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="poll-footer">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }} />
      </footer>
    </div>
  );
};

export default CreatePoll;

