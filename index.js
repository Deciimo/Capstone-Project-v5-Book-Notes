import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ENTER YOUR DATABASE NAME HERE",
    password: "ENTER YOUR PASSWORD HERE",
    port: 5432,
});
  
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",async (req,res) => {
    try {
        const result = await db.query (
            "SELECT * FROM book JOIN description ON book.id = description.id");
        const bookData = result.rows
        res.render("index.ejs",{book:bookData});
    }catch (err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/add", (req, res) => {
    const result = req.body
    res.render("add.ejs");
});

app.post("/add", async (req, res) => {
    const { title, book_cover, description_text, date, score } = req.body;

    try {
        // Insert the new book into the 'book' table
        const insertBookQuery = "INSERT INTO book (title, book_cover) VALUES ($1, $2) RETURNING id";
        const bookResult = await db.query(insertBookQuery, [title, book_cover]);
        const bookId = bookResult.rows[0].id;

        // Insert the description into the 'description' table, linking it to the book by ID
        const insertDescriptionQuery = "INSERT INTO description (id, description_text, date, score) VALUES ($1, $2, $3, $4)";
        await db.query(insertDescriptionQuery, [bookId, description_text, date, score]);

        // Redirect to the homepage after successfully adding the book
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/edit/:id", async (req, res) => {
    const bookId = req.params.id;

    try {
        // Fetch the book and description data for the specified ID
        const result = await db.query(
            "SELECT * FROM book JOIN description ON book.id = description.id WHERE book.id = $1",
            [bookId]
        );

        const bookData = result.rows[0];
        res.render("edit.ejs", { book: bookData });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/edit/:id", async (req, res) => {
    const bookId = req.params.id;
    const { title, book_cover, description_text, date, score } = req.body;

    try {
        // Update the book details in the 'book' table
        const updateBookQuery = "UPDATE book SET title = $1, book_cover = $2 WHERE id = $3";
        await db.query(updateBookQuery, [title, book_cover, bookId]);

        // Update the description details in the 'description' table
        const updateDescriptionQuery = "UPDATE description SET description_text = $1, date = $2, score = $3 WHERE id = $4";
        await db.query(updateDescriptionQuery, [description_text, date, score, bookId]);

        // Redirect to the homepage after successfully updating the book
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/delete/:id", async (req, res) => {
    const bookId = req.params.id;
    console.log("Deleting book with ID:", bookId);

    try {
        // Delete the row with the specified ID from both the 'book' and 'description' tables
        const deleteBookQuery = "DELETE FROM book WHERE id = $1";
        await db.query(deleteBookQuery, [bookId]);

        const deleteDescriptionQuery = "DELETE FROM description WHERE id = $1";
        await db.query(deleteDescriptionQuery, [bookId]);

        // Redirect to the homepage after successfully deleting the book
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log (`Server is running on port ${port}.`)
});
