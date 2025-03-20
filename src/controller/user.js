import pool from "../models/database.js";

export const signUp = async (req, res) => {
    const { username, password } = req.body;
    try{
        const checkAccount = await pool.query("SELECT * FROM reader WHERE username = $1", [username]);

        if(checkAccount.rowCount.length > 0){
            console.log("username already exist");
            res.redirect() //no login page yet
        }else{
            const result = await pool.query("INSERT INTO reader (username, password) VALUES ($1, $2)", [username, password]);

            if(result){
                console.log("you have successfully sign up");
                res.status(201).redirect("/home");
            }
        }
    }catch(err){
        console.error("Error cannot sign up", err);
    }
}

export const logIn = async (req, res) => {
    const { username, password } = req.body;
    try{
        const result = await pool.query("SELECT * FROM reader WHERE username = $1 AND password = $2", [username, password]);

        if(result){
            console.log("Successfully login");
            res.status(202).redirect("/home");
        }
    }catch(err){
        console.error("Error cannot login", err);
    }
}

