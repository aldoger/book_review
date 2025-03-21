import pool from "../models/database.js";

export const signUp = async (req, res) => {
    const { username, password } = req.body;
    try {
        const checkAccount = await pool.query("SELECT * FROM reader WHERE username = $1", [username]);

        if (checkAccount.rowCount > 0) {
            console.log("Username already exists");
            return res.status(400).json({ error: "Username already exists" }); 
        }

        const result = await pool.query(
            "INSERT INTO reader (username, password) VALUES ($1, $2) RETURNING *", 
            [username, password]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ error: "Error cannot create account" });
        }

        req.session.id_reader = result.rows[0].id_reader;  

        console.log("Successfully signed up, ID:", req.session.id_reader);

       
        return res.redirect("/home");

    } catch (err) {
        console.error("Error during sign up", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const logIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM reader WHERE username = $1 AND password = $2", [username, password]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Error: Cannot find account with username " + username });
        }

        req.session.id_reader = result.rows[0].id_reader;  

        console.log("Successfully signed up, ID:", req.session.id_reader);

       
        return res.redirect("/home");
    } catch (err) {
        console.error("Error cannot login", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

