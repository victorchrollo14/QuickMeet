export const roleType = `CREATE TYPE role AS ENUM('host', 'attendee')`;

export const statusType = `CREATE TYPE status AS ENUM ('active', 'ended', 'initiated')`;

export const createUsers = `CREATE TABLE users(
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50) NOT NULL UNIQUE,
    profile_pic TEXT,
    locale VARCHAR(255)
);`;

export const createGuest = `CREATE TABLE guests(
    guest_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(60) DEFAULT 'guest'
)`;

export const createMeet = `CREATE TABLE meetings(
    meeting_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    room_id VARCHAR(50),
    status status NOT NULL,
    UNIQUE(meeting_id, user_id),
    CHECK(
        start_time <= end_time
        OR end_time IS NULL
    ),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)`;

export const createParticipant = `CREATE TABLE participants(
    participant_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    guest_id INT,
    meeting_id INT,
    role role NOT NULL,
    UNIQUE(user_id, meeting_id),
    UNIQUE(guest_id, meeting_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(meeting_id) REFERENCES meetings(meeting_id),
    FOREIGN KEY(guest_id) REFERENCES guests(guest_id)
)`;

export const createMessages = `CREATE TABLE messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    guest_id INT,
    meeting_id INT,
    content TEXT,
    message_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(meeting_id) REFERENCES meetings(meeting_id),
    FOREIGN KEY(guest_id) REFERENCES guests(guest_id)
)`;

export const createGuestMeet = `CREATE TABLE guest_meetings(
    meeting_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    guest_id INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    room_id VARCHAR(50),
    status status NOT NULL,
    UNIQUE(meeting_id, guest_id),
    CHECK(
        start_time <= end_time
        OR end_time IS NULL
    ),
    FOREIGN KEY(guest_id) REFERENCES guests(guest_id)
)`;

export const createGuestMessages = `CREATE TABLE guest_messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    guest_id INT,
    user_id INT,
    meeting_id INT,
    content TEXT,
    message_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(guest_id) REFERENCES guests(guest_id),
    FOREIGN KEY(meeting_id) REFERENCES guest_meetings(meeting_id)
)`;
