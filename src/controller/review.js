import pool from "../models/database.js";

export const addList = async (req, res) => {
    const { id_book } = req.body;
    
    if(req.session.id_reader == null){
        console.log("Must have an account first");
        res.redirect("/signup");
    }

    const id_reader = req.session.id_reader;

    try{
        const result = await pool.query("INSERT INTO bookreview (id_reader, id_book, review, rate) VALUES ($1, $2, $3, $4) RETURNING *", [id_reader, id_book, "", 0]);

        if(result.rowCount === 0){
            res.status(400).json("Error book already on the list");
        }

        return res.status(200).redirect("/home");
    }catch(err){
        console.error("Error cannot add book to list");
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const reviewBook = async (req, res) => {    
    const { id_reader, id_book, review, rate } = req.body;
    console.log(id_reader, id_book);

    if (!id_reader) {
        return res.status(401).json({ message: "Unauthorized: No reader ID found" });
    }

    try{
        const result = await pool.query("UPDATE bookreview SET review = $1, rate = $2 WHERE id_reader = $3 AND id_book = $4 RETURNING *", [review, rate, id_reader, id_book]);

        if(result.rowCount === 0){
            return res.status(404).json("Error cannot found the book");
        }

        req.session.id_reader = id_reader;

        return res.redirect("/bookreview");
    }catch(err){
        console.error("Error cannot post review:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


export const deleteBookReview = async (req, res) => {
    const { id_book } = req.body;
    const id_reader = req.session.id_reader;


    try{
        const result = await pool.query("DELETE FROM bookreview WHERE id_reader = $1 AND id_book = $2 RETURNING *", [id_reader, id_book]);

        if(result.rowCount === 0){
            res.status(404).json("Error cannot found review");
        }

        return res.redirect("/bookreview");
    }catch(err){
        console.error("Error cannot delete review");
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getAllBook = async () => {
    try{
        const result = await pool.query("SELECT * FROM book");

        if(result.rowCount === 0 ){
            throw new Error("No data available")
        }

        return result.rows;
    }catch(err){
        console.error("Error cannot fetch data", err);
        throw err;
    }
}

export const getUserReview = async (req, res) => {
    if (!req.session.id_reader) {
        console.log("Must have an account first");
        return null; 
    }

    const id_reader = req.session.id_reader;

    try {
        const result = await pool.query(
            `SELECT * FROM bookreview  
             JOIN book ON bookreview.id_book = book.id_book 
             WHERE bookreview.id_reader = $1`,
            [id_reader]
        );

        return result.rowCount > 0 ? result.rows : [];
    } catch (err) {
        console.error("Error cannot get review:", err);
        throw err; 
    }
};