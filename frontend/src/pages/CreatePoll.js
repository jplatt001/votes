import React, { useState } from 'react';
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
