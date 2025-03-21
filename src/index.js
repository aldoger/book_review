import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';
import route from './routes/routes.js'
import db, { connect } from './models/database.js';
import session from 'express-session';

dotenv.config()

const app = express()

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

db.connect();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: process.env.SECRET_KEY,   
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));

app.use((req, res, next) => {
    res.locals.id_reader = req.session.id_reader || null; 
    next();
});


app.use("/", route);

const startserver = async () => {
    try{
        await connect();
        app.listen(PORT, () => {
            console.log("Server is listening on port "+PORT);
        });
    }catch(err){
        console.error("Server failed to start", err)
    }
}

startserver();