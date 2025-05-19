CREATE DATABASE polling_system;
USE polling_system;

-- Table to store polls
CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    is_public BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255)
);

-- Table to store poll options (answers)
CREATE TABLE poll_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

-- Table to store poll votes
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT,
  option_id INT,
  FOREIGN KEY (poll_id) REFERENCES polls(id),
  FOREIGN KEY (option_id) REFERENCES poll_options(id)
);

-- pdate your polls table to include start_time and end_time for Timed Polls & Deadlines
ALTER TABLE polls 
ADD COLUMN start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN end_time DATETIME;

-- Update your polls table to include a type field for Multiple Question Types (Checkboxes/Multiple Choice)
ALTER TABLE polls 
ADD COLUMN type ENUM('single', 'multiple') DEFAULT 'single';