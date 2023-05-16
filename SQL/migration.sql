DROP TABLE IF EXISTS users ;


CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_email VARCHAR(255)

);

INSERT INTO users (user_email) VALUES ('seb@test.com');
INSERT INTO users (user_email) VALUES ('seb2@test.com');
INSERT INTO users (user_email) VALUES ('seb3@test.com');
INSERT INTO users (user_email) VALUES ('seb4@test.com');
DROP TABLE IF EXISTS task;
CREATE TABLE task (
  task_id SERIAL PRIMARY KEY,
  todo VARCHAR(255),
  completed BOOLEAN NOT NULL DEFAULT false,
  user_id SERIAL REFERENCES users(user_id)
);

INSERT INTO task (todo) VALUES ('this is a test task 1');
INSERT INTO task (todo) VALUES ('this is a test task 2');
INSERT INTO task (todo) VALUES ('this is a test task 3');
INSERT INTO task (todo) VALUES ('this is a test task 4');
INSERT INTO task (todo, user_id) VALUES (' this is an additional task for user 1', 1);
INSERT INTO task (todo, completed,user_id) VALUES ('true test', TRUE, 1);
INSERT INTO task (todo, completed,user_id) VALUES ('true test 2', TRUE, 1);