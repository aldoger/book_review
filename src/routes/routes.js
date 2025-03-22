import { Router } from "express";
import { signUp, logIn } from "../controller/user.js";
import { addList, getAllBook, getUserReview, reviewBook } from "../controller/review.js";

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
            id_reader: res.locals.id_reader || null 
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

route.get("/bookreview", getUserReview);



//post methods
route.post("/signup", signUp);
route.post("/login", logIn);
route.post("/addlist", addList);

//put methods
route.put("/reviewbook", reviewBook);

//delete methods

export default route;