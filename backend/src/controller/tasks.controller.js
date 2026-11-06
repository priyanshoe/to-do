const jwt = require('jsonwebtoken');
const pool = require('../db/connection')
const redisClient = require("../db/redis");

require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;
const table_name = process.env.Tasks_Table;

async function getTasks(req, res) {
    try {
        token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Please login first" });
        const tokenData = jwt.verify(token, jwt_secret);
        const userId = tokenData.userId;
        // check redis
        const cacheKey = `tasks:user:${userId}`
        let cachedTasks = null;
        try {
            cachedTasks = await redisClient.get(cacheKey);
        } catch (redisError) {
            console.error("Redis GET failed: ",redisError);
            
        }
        if(cachedTasks != null){
        return res.status(200).json({ message: "Data", data: JSON.parse(cachedTasks) })
        }
        
        // fetch from database
        const query = `SELECT * FROM ${table_name} WHERE userId = ?`
        const [data] = await pool.query(query, [userId])
        // save cache
        try {
            await redisClient.set(
                cacheKey,
                JSON.stringify(data),
                { EX: 60}
            )
        } catch (redisError) {
            console.error("Redis SET failed:", redisError.message);
        }

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
        await redisClient.del(`tasks:user:${tokenData.userId}`)
        return res.status(200).json({ message: "task added", data: inserted })

    } catch (err) {
        return res.status(500).json({ message: "failed", error: err.message });
    }
}


async function deleteTask(req, res) {
    try{
        const { id } = req.params
        if(id === null || id === undefined) return res.status(409).json({ message: "task is not provided" });
        
        token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authorised" });

        const checkTask = `SELECT id, userId from ${table_name} WHERE id = ?`
        const [IDs] = await pool.query(checkTask,[id]);
        if(IDs.length===0) return res.status(500).json({message:"Task not fond"});
        const tokenData = jwt.verify(token, jwt_secret)
        if(tokenData.userId !== IDs[0].userId) return res.status(500).json({message:"Not authorised"})

        const query = `DELETE from ${table_name} WHERE id = ? AND userId = ?`;
        const deleted = await pool.query(query, [id, IDs[0].userId]);
        await redisClient.del(`tasks:user:${tokenData.userId}`)
        return res.status(200).json({ message: "task deleted", data: deleted })
    } catch (err) {
        return res.status(500).json({ message: "failed", error: err.message });
    }
}


module.exports = { getTasks, createTask, deleteTask };