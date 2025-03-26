import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;


const pool = new Pool({ //create pool
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
});

export const connect = async () => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL Database connected successfully!");
        client.release(); 
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1); 
    }
};

export default pool;
