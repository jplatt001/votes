// backend/server.js
/*
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // or your MySQL server host
    user: 'root',       // your MySQL username
    password: 'Juninho99@', // your MySQL password
    database: 'polling_system'  // Database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

// Endpoint to create a poll
app.post('/api/polls', (req, res) => {
    const { question, options, isPublic } = req.body;
    const query = 'INSERT INTO polls (question, is_public) VALUES (?, ?)';
    db.query(query, [question, isPublic], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to create poll' });
        }

        const pollId = result.insertId;
        options.forEach(option => {
            const optionQuery = 'INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)';
            db.query(optionQuery, [pollId, option], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to add options' });
                }
            });
        });

        res.status(201).json({ message: 'Poll created successfully' });
    });
});

// Endpoint to get active polls
app.get('/api/polls', (req, res) => {
    const query = 'SELECT * FROM polls WHERE is_public = true';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to fetch polls' });
        }
        res.json(result);
    });
});

// Endpoint to vote on a poll option
app.post('/api/polls/:pollId/vote', (req, res) => {
    const { pollId } = req.params;
    const { optionId } = req.body;

    // Check if the optionId is valid
    const checkOptionQuery = 'SELECT * FROM poll_options WHERE id = ? AND poll_id = ?';
    db.query(checkOptionQuery, [optionId, pollId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to check option' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Option not found for this poll' });
        }

        const query = 'INSERT INTO poll_votes (poll_option_id) VALUES (?)';
        db.query(query, [optionId], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to vote' });
            }
            res.status(200).json({ message: 'Vote submitted successfully' });
        });
    });
});

// Endpoint to get poll details along with options
app.get('/api/polls/:pollId', (req, res) => {
    const pollId = req.params.pollId;

    const pollQuery = 'SELECT * FROM polls WHERE id = ?';
    const optionsQuery = 'SELECT * FROM poll_options WHERE poll_id = ?';

    db.query(pollQuery, [pollId], (err, pollResult) => {
        if (err) {
            console.error('Error fetching poll:', err);
            return res.status(500).json({ error: 'Failed to fetch poll' });
        }

        if (pollResult.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const poll = pollResult[0];

        // Fetch the options for this poll
        db.query(optionsQuery, [pollId], (err, optionsResult) => {
            if (err) {
                console.error('Error fetching poll options:', err);
                return res.status(500).json({ error: 'Failed to fetch poll options' });
            }

            poll.options = optionsResult;  // Add the options to the poll object
            res.json(poll);  // Return the poll object with its options
        });
    });
});

// Endpoint to get poll results
app.get('/api/polls/:pollId/results', (req, res) => {
    const pollId = req.params.pollId;

    const query = `
        SELECT po.id AS option_id, po.option_text, COUNT(v.id) AS vote_count
        FROM poll_options po
        LEFT JOIN poll_votes v ON po.id = v.poll_option_id
        WHERE po.poll_id = ?
        GROUP BY po.id
    `;

    db.query(query, [pollId], (err, results) => {
        if (err) {
            console.error('Error fetching poll results:', err);
            return res.status(500).json({ error: 'Failed to fetch results' });
        }
        res.json(results);
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Juninho99@',
    database: 'polling_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

// Endpoint to create a poll (with start_time, end_time, type)
app.post('/api/polls', (req, res) => {
    const { question, options, isPublic, startTime, endTime, type } = req.body;

    const query = 'INSERT INTO polls (question, is_public, start_time, end_time, type) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [question, isPublic, startTime, endTime, type], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to create poll' });
        }

        const pollId = result.insertId;
        options.forEach(option => {
            const optionQuery = 'INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)';
            db.query(optionQuery, [pollId, option], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to add options' });
                }
            });
        });

        res.status(201).json({ message: 'Poll created successfully' });
    });
});

// Endpoint to get active polls (within time window)
app.get('/api/polls', (req, res) => {
    const now = new Date();
    const query = `
        SELECT * FROM polls
        WHERE is_public = true
        AND start_time <= ?
        AND (end_time IS NULL OR end_time >= ?)
    `;
    db.query(query, [now, now], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to fetch polls' });
        }
        res.json(result);
    });
});

// Endpoint to vote on a poll option (supports single and multiple choice)
app.post('/api/polls/:pollId/vote', (req, res) => {
    const { pollId } = req.params;
    const { optionIds } = req.body; // Expecting an array

    // Validate input
    if (!Array.isArray(optionIds) || optionIds.length === 0) {
        return res.status(400).json({ message: 'No options selected' });
    }

    const getPollTypeQuery = 'SELECT type FROM polls WHERE id = ?';
    db.query(getPollTypeQuery, [pollId], (err, pollResult) => {
        if (err || pollResult.length === 0) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to retrieve poll type' });
        }

        const type = pollResult[0].type;
        if (type === 'single' && optionIds.length > 1) {
            return res.status(400).json({ message: 'This poll allows only one selection' });
        }

        // Validate options belong to the poll
        const validateOptionsQuery = `
            SELECT id FROM poll_options
            WHERE poll_id = ? AND id IN (?)
        `;
        db.query(validateOptionsQuery, [pollId, optionIds], (err, validOptions) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to validate options' });
            }

            if (validOptions.length !== optionIds.length) {
                return res.status(400).json({ message: 'Invalid options selected' });
            }

            // Insert all votes
            const values = optionIds.map(id => [pollId, id]);
            const insertQuery = 'INSERT INTO votes (poll_id, option_id) VALUES ?';
            db.query(insertQuery, [values], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to submit vote(s)' });
                }
                res.status(200).json({ message: 'Vote(s) submitted successfully' });
            });
        });
    });
});


// Endpoint to get closed (expired) polls
app.get('/api/polls/closed', (req, res) => {
    const query = `
        SELECT * FROM polls 
        WHERE is_public = true 
        AND end_time IS NOT NULL 
        AND end_time < NOW()
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching closed polls:', err);
            return res.status(500).json({ message: 'Failed to fetch closed polls' });
        }
        res.json(result);
    });
});


// Endpoint to get poll details and options
app.get('/api/polls/:pollId', (req, res) => {
    const pollId = req.params.pollId;

    const pollQuery = 'SELECT * FROM polls WHERE id = ?';
    const optionsQuery = 'SELECT * FROM poll_options WHERE poll_id = ?';

    db.query(pollQuery, [pollId], (err, pollResult) => {
        if (err) {
            console.error('Error fetching poll:', err);
            return res.status(500).json({ error: 'Failed to fetch poll' });
        }

        if (pollResult.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const poll = pollResult[0];

        db.query(optionsQuery, [pollId], (err, optionsResult) => {
            if (err) {
                console.error('Error fetching poll options:', err);
                return res.status(500).json({ error: 'Failed to fetch poll options' });
            }

            poll.options = optionsResult;
            res.json(poll);
        });
    });
});

// Endpoint to get poll results
app.get('/api/polls/:pollId/results', (req, res) => {
    const pollId = req.params.pollId;

    const query = `
        SELECT po.id AS option_id, po.option_text, COUNT(v.id) AS vote_count
        FROM poll_options po
        LEFT JOIN votes v ON po.id = v.option_id
        WHERE po.poll_id = ?
        GROUP BY po.id
    `;

    db.query(query, [pollId], (err, results) => {
        if (err) {
            console.error('Error fetching poll results:', err);
            return res.status(500).json({ error: 'Failed to fetch results' });
        }
        res.json(results);
    });
});




// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

