DROP DATABASE IF EXISTS gentoo;
CREATE DATABASE gentoo;
USE gentoo;

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

INSERT INTO rooms (name) VALUES
('Lobby'),
('Music');

INSERT INTO channels (name, room_id) VALUES
('general', 1),
('anime', 1),
('travel', 1),
('general', 2),
('alternative', 2),
('lofi', 2);


-- CREATE TABLE friends (
--   user_id INT NOT NULL,
--   other_id INT NOT NULL,
--   room_id VARCHAR(255) NOT NULL,
--   PRIMARY KEY (user_id, other_id),
--   FOREIGN KEY (user_id) REFERENCES users(id),
--   FOREIGN KEY (other_id) REFERENCES users(id)
-- );

-- CREATE TABLE notifications (
--   id INT NOT NULL auto_increment,
--   content VARCHAR(255) NOT NULL,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE direct_messages (
--   id INT NOT NULL auto_increment,
--   created_at TIMESTAMP DEFAULT NOW(),
--   user_id INT NOT NULL,
--   room_id VARCHAR(255) NOT NULL,
--   content VARCHAR(255) NOT NULL,
--   PRIMARY KEY (id),
--   FOREIGN KEY(user_id) REFERENCES users(id)
-- );
