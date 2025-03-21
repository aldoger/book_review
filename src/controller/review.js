import pool from "../models/database.js";

export const addList = async (req, res) => {
    const { id_reader, id_book } = req.body;
    try{
        const result = await pool.query("INSERT INTO bookreview (id_reader, id_book, review, rate) VALUES ($1, $2, $3, $4) RETURNING *", [id_reader, id_book, "", 0]);

        if(result.rowCount === 0){
            res.status(400).json("Error book already on the list");
        }

        return res.status(200).json("successfully added book to list");
    }catch(err){
        console.error("Error cannot add book to list");
    }
}

export const reviewBook = async (req, res) => {    
    const { id_reader, id_book, review, rate } = req.body;
    try{
        const result = await pool.query("UPDATE bookreview SET review = $1, rate = $2 WHERE id_reader = $4 AND id_book = $5 RETURNING *", [review, rate, id_reader, id_book]);

        if(result.rowCount === 0){
            res.status(404).json("Error cannot found the book");
        }

        return res.status(200).json("successfully post review");
    }catch(err){
        console.error("Error cannot post review");
    }
}

export const deleteBookReview = async (req, res) => {
    const { id_reader, id_book } = req.body;
    try{
        const result = await pool.query("DELETE FROM bookreview WHERE id_reader = $1 AND id_book = $2 RETURNING *", [id_reader, id_book]);

        if(!result){
            res.status(404).json("Error cannot found review");
        }

        return res.status(200).json("Successfully delete review");
    }catch(err){
        console.error("Error cannot delete review");
    }
}

export const updateBookReview = async (req, res) => {
    const { id_reader, id_book, review, rate } = req.body;

    try{
        const result = await pool.query("UPDATE bookreview SET review = $1, rate = $2 WHERE id_reader = $3 AND id_book = $4 RETURNING *", [review, rate, id_reader, id_book]);

        if(result.rowCount === 0){
            res.status(404).json("Cannot found the review book");
        }

        return res.status(200).json("Successfully update review");
    }catch(err){
        console.error("Error cannot update review");
    }
}

export const getAllBook = async (req, res) => {
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