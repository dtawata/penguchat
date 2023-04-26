DROP DATABASE IF EXISTS untitled_chat;
CREATE DATABASE untitled_chat;
USE untitled_chat;

CREATE TABLE users (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  email VARCHAR(255) NOT NULL UNIQUE,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  PRIMARY KEY (id)
);

CREATE TABLE rooms (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NULL DEFAULT '/img/default.jpg',
  PRIMARY KEY (id)
);

CREATE TABLE channels (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);

CREATE TABLE joined_rooms (
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY (user_id, room_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE room_messages (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  channel_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id),
  FOREIGN KEY(channel_id) REFERENCES channels(id)
);

CREATE TABLE friends (
  user_id INT NOT NULL,
  other_id INT NOT NULL,
  room_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id, other_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (other_id) REFERENCES users(id)
);

CREATE TABLE direct_messages (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INT NOT NULL,
  room_id VARCHAR(255) NOT NULL,
  content VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE friend_requests (
  id INT NOT NULL auto_increment,
  requestee_id INT NOT NULL,
  requester_id INT NOT NULL,
  pending BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (requestee_id) REFERENCES users(id),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

INSERT INTO rooms (name, image) VALUES
('Lobby','/img/room1.jpg'),
('Music','/img/room2.jpg'),
('Travels','/img/room3.jpg');

INSERT INTO channels (name, room_id) VALUES
('general', 1),
('hello world', 1),
('travel', 1),
('general', 2),
('alternative', 2),
('lofi', 2),
('hip hop', 2),
('tokyo', 3),
('seoul', 3),
('new york', 3);

INSERT INTO users (email, fname, lname, username, password, image) VALUES
('email1@gmail.com', 'f', 'l', 'daniel', 'pass', '/img/user1.jpg'),
('email2@gmail.com', 'f', 'l', 'ashley', 'pass', '/img/user2.jpg'),
('email3@gmail.com', 'f', 'l', 'john', 'pass', '/img/user3.jpg');

INSERT INTO joined_rooms (user_id, room_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3);

--  (user_id, other_id, room_id) VALUES
-- (4, 1, '1:4'),
-- (4, 2, '2:4'),
-- (4, 3, '3:4'),
-- (1, 3, '1:3'),
-- (3, 1, '1:3');

-- CREATE TABLE notifications (
--   id INT NOT NULL auto_increment,
--   content VARCHAR(255) NOT NULL,
--   PRIMARY KEY (id)
-- );
