create table Person (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surName VARCHAR(255) NOT NULL
);

create table Post (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Person(id)
);