const jwt = require('jsonwebtoken');
const db = require('../db/connection')

require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;
const table_name = process.env.Tasks_Table;

function getTasks(req, res) {
    

    token = req.cookies.token;
    if (!token) {
        return res.json({ message: "Please login first" })
    }
    const userData = jwt.verify(token, jwt_secret);

    sql = `SELECT * FROM ${table_name} WHERE userId = ?`
    db.query(sql, userData.userId, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
}

function createTask(req, res) {

    token = req.cookies.token;
    if (!token) {
        return res.json({ message: "Please login first" })
    }

    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const data = [
        userData.userId,
        req.body.title,
        req.body.description
    ]

    const sql = `INSERT INTO ${table_name} (userId, title, description) VALUES (?)`;
    db.query(sql, [data], (err, result) => {
        if (err) return res.json(err);
        return res.json("Task Created Successfully");
    })
}


function deleteTask(req,res){
    console.log(req.body.id);
    
    const sql = `DELETE from ${table_name} WHERE taskId = ?`;
    db.query(sql, req.body.id, (err, result)=>{
        if(err) return res.json(err);
        res.json("Task deleted success")
    })
}


module.exports = { getTasks, createTask, deleteTask };