import { Router } from "express";
import { signUp, logIn } from "../controller/user.js";

const route = Router();


//get methods
route.get("/", (req, res) => {
    res.redirect("/home");
});

route.get("/home", (req, res) => {
    res.render("index");
});


//post methods
route.post("/signup", signUp);
route.post("/login", logIn);

export default route;