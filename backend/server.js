const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

// Create poll endpoint: now requires password if isPublic === false
app.post('/api/polls', (req, res) => {
    const { question, options, isPublic, startTime, endTime, type, password } = req.body;

    if (!isPublic && (!password || password.trim() === '')) {
        return res.status(400).json({ message: 'Password is required for private polls' });
    }

    const query = 'INSERT INTO polls (question, is_public, start_time, end_time, type, password) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [question, isPublic, startTime, endTime, type, isPublic ? null : password], (err, result) => {
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

// Middleware to check poll password before returning poll details (vote) or results
function checkPollPassword(req, res, next) {
    const pollId = req.params.pollId;
    const providedPassword = req.headers['x-poll-password'];

    const pollQuery = 'SELECT password FROM polls WHERE id = ?';
    db.query(pollQuery, [pollId], (err, results) => {
        if (err) {
            console.error('Error fetching poll password:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const pollPassword = results[0].password;

        if (pollPassword) {
            // Poll is private, must provide password header and match
            if (!providedPassword) {
                return res.status(401).json({ message: 'Password required to access this poll' });
            }
            if (providedPassword !== pollPassword) {
                return res.status(403).json({ message: 'Incorrect password' });
            }
        }
        // else public poll, no password needed

        next();
    });
}

// Get active polls - only return public polls here
app.get('/api/polls', (req, res) => {
    const now = new Date();
    const query = `
        SELECT * FROM polls
        WHERE start_time <= ?
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

// Vote on poll options - password protected if poll is private
app.post('/api/polls/:pollId/vote', checkPollPassword, (req, res) => {
    const { pollId } = req.params;
    const { optionIds } = req.body;

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

// Get closed polls (only public for listing)
app.get('/api/polls/closed', (req, res) => {
    const query = `
        SELECT * FROM polls 
        WHERE end_time IS NOT NULL 
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

// Get poll details and options - password protected if private
app.get('/api/polls/:pollId', checkPollPassword, (req, res) => {
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

// Get poll results - password protected if private
app.get('/api/polls/:pollId/results', checkPollPassword, (req, res) => {
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

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
