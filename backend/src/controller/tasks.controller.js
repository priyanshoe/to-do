const jwt = require('jsonwebtoken');
const pool = require('../db/connection')

require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;
const table_name = process.env.Tasks_Table;

async function getTasks(req, res) {
    try {
        token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Please login first" });
        const tokenData = jwt.verify(token, jwt_secret);
        const query = `SELECT * FROM ${table_name} WHERE userId = ?`
        const [data] = await pool.query(query, [tokenData.userId])
        return res.status(200).json({ message: "Data", data: data })

    } catch (err) {
        return res.status(500).json({ message: "Please login first", error: err.message });
    }
}

async function createTask(req, res) {
    try {

        token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Please login first" });
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const data = [
            tokenData.userId,
            req.body.title,
            req.body.description
        ]
        const query = `INSERT INTO ${table_name} (userId, title, description) VALUES (?,?,?)`;
        const [inserted] = await pool.query(query, data);
        return res.status(200).json({ message: "task added", data: inserted })

    } catch (err) {
        return res.status(500).json({ message: "failed", error: err.message });
    }
}


async function deleteTask(req, res) {
    try{
        const { id } = req.body
        
        token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authorised" });

        const checkTask = `SELECT taskId, userId from ${table_name} WHERE taskId = ?`
        const [IDs] = await pool.query(checkTask,[id]);
        if(IDs.length===0) return res.status(500).json({message:"Task not fond"});
        const tokenData = jwt.verify(token, jwt_secret)
        if(tokenData.userId !== IDs[0].userId) return res.status(500).json({message:"Not authorised"})

        const query = `DELETE from ${table_name} WHERE taskId = ?`;
        const deleted = await pool.query(query, [id]);
        return res.status(200).json({ message: "task deleted", data: deleted })
    } catch (err) {
        return res.status(500).json({ message: "failed", error: err.message });
    }
}


module.exports = { getTasks, createTask, deleteTask };