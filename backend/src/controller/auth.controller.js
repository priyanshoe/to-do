const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db/connection')
require('dotenv').config();

const table_name = process.env.Users_Table;
const jwt_secret = process.env.JWT_SECRET;


function registerUser(req, res) {



    const checkUser = `SELECT * FROM ${table_name} WHERE email = ?`
    db.query(checkUser, [req.body.email], async (err, result) => {
        if (err) return res.json(err);

        if (result.length > 0) return res.json("user already exist")


        const hash = await bcrypt.hash(req.body.password, 10)
        const values = [
            req.body.name,
            req.body.email,
            hash,
        ]


        const insertUser = `INSERT INTO ${table_name} (\`name\`, \`email\`, \`password\`) values (?)`;
        db.query(insertUser, [values], (err, data) => {
            if (err) return res.json(err);
            var token = jwt.sign({ email: req.body.email, userId: data.insertId }, jwt_secret);
            res.cookie("token", token);
            return res.json("Register Success");
        })
    })






}


function loginUser(req, res) {


    const sql = `SELECT * FROM ${table_name} WHERE email = ?`;
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json(err);

        if (data.length === 0) {
            return res.json({ message: "User not found" });
        }

        bcrypt.compare(req.body.password, data[0].password, function (err, result) {
            if (err) return res.json(err);


            if (result) {
                var token = jwt.sign({ email: req.body.email, userId: data[0].userId }, jwt_secret);
                res.cookie("token", token);
                return res.json(1);
            }
            else {
                return res.json(0);
            }

        });


    })
}



function logoutUser(req, res) {
    res.clearCookie("token");
    return res.json("Logged out");
}


module.exports = { registerUser, loginUser, logoutUser };