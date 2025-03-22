import { Router } from "express";
import { signUp, logIn } from "../controller/user.js";
import { addList, deleteBookReview, getAllBook, getUserReview, reviewBook } from "../controller/review.js";
import pool from "../models/database.js";

const route = Router();


//get methods
route.get("/", (req, res) => {
    res.redirect("/home");
});

route.get("/home", async (req, res) => {
    try {
        const books = await getAllBook();

        res.render("index", { 
            books: books, 
        });

    } catch (err) {
        res.status(500).json({ error: "Error loading books" });
    }
});

route.get("/signup", (req, res) => {
    res.render("signup");
});

route.get("/login", (req, res) => {
    res.render("login");
});

route.get("/bookreview", async (req, res) => {
    if (!req.session.id_reader) {
        return res.redirect("/signup"); 
    }

    try {
        const reviews = await getUserReview(req); 

        res.render("bookreviews", { 
            reviews: reviews,  
        });
    } catch (err) {
        console.error("Error loading reviews:", err);
        res.status(500).json({ error: "Error loading reviews" });
    }
});

route.get("/updatereview", async (req, res) => {
    const {  id_book } = req.query;
    const id_reader = req.session.id_reader;

    console.log("id_book:", id_book);  
    console.log("id_reader:", id_reader);  

    if (!id_book || !id_reader) {
        return res.status(400).send("Missing required parameters");
    }

    try{
        if (!id_book || !id_reader) {
            return res.status(400).send("Missing required parameters");
        }
    
        const result = await pool.query(`
            SELECT bookreview.review, bookreview.rate, book.src
            FROM bookreview
            JOIN book ON bookreview.id_book = book.id_book
            WHERE bookreview.id_reader = $1 AND bookreview.id_book = $2`,
            [id_reader, id_book]
        );
        
    
        if(result.rowCount == 0){   
            return res.redirect("/bookreview");
        }

        const { review, rate, src } = result.rows[0];

        res.render("updatereview", { src, review, rate, id_book, id_reader });
    }catch(err){
        console.error("Error retrieving review:", err);  
        return res.status(500).send("Internal Server Error: Unable to retrieve review.");
    }
});



//post methods
route.post("/signup", signUp);
route.post("/login", logIn);
route.post("/addlist", addList);
route.post("/reviewbook", reviewBook);
route.post("/deletereview", deleteBookReview);


export default route;