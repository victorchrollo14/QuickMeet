CREATE TABLE users(
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50) NOT NULL UNIQUE,
    profile_pic TEXT,
    locale VARCHAR(255)
);

-- you need to create this custom type
CREATE TYPE status AS ENUM ('active', 'ended');

CREATE TABLE meetings(
    meeting_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    code VARCHAR(50),
    status status NOT NULL,
    UNIQUE(meeting_id, user_id),
    CHECK(
        start_time <= end_time
        OR end_time IS NULL
    ),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- enum type for role
CREATE TYPE role AS ENUM('host', 'attendee');

CREATE TABLE participants(
    participant_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    meeting_id INT,
    role role NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(meeting_id) REFERENCES meetings(meeting_id)
);

CREATE TABLE messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    meeting_id INT,
    content TEXT,
    message_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(meeting_id) REFERENCES meetings(meeting_id)
);