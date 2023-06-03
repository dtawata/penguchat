DROP DATABASE IF EXISTS chat;
CREATE DATABASE chat;
USE chat;

CREATE TABLE users (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  email VARCHAR(255) NOT NULL UNIQUE,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT 'user1.jpg',
  PRIMARY KEY (id)
);

CREATE TABLE rooms (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NULL DEFAULT 'default.jpg',
  created_by INT,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE channels (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
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
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (channel_id) REFERENCES channels(id)
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
  FOREIGN KEY (user_id) REFERENCES users(id)
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

CREATE TABLE room_invites (
  id INT NOT NULL auto_increment,
  requestee_id INT NOT NULL,
  requester_id INT NOT NULL,
  room_id INT NOT NULL,
  pending BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (requestee_id) REFERENCES users(id),
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);