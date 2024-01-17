# Capstone-Project-v5-Book-Notes
This the very basic version i dont use any css design but you can redesign this it got css but very basic
i focus how can i use db (postgreSQL) here so i dont want to waste my time in css and i want to learn the next lesson which is react
maybe ill update this or not i dont know 

HOW TO USE
npm i

create table use this

CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    book_cover TEXT
);

CREATE TABLE description (
    id INTEGER PRIMARY KEY REFERENCES book(id) ON DELETE CASCADE,
    description_text TEXT NOT NULL,
    date DATE,
    score INTEGER CHECK (score >= 1 AND score <= 10)
);

then use 
nodemon index.js or 
if you dont have nodemon
use node index.js
make sure you install node js!
