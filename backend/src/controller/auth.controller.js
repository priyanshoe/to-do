require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db/connection')

const table_name = process.env.Users_Table;
const jwt_secret = process.env.JWT_SECRET;


async function registerUser(req, res) {
    try{
        const { name, email, password} = req.body;
        const checkUser = `SELECT * FROM ${table_name} WHERE email = ?`;
        const [user] = await pool.query(checkUser, [email]);
        if(user.length > 0) return res.status(409).json({message:"user alreay exist"});
        const hash = await bcrypt.hash(password, 5);
        const insertUser =  `INSERT INTO ${table_name} (name, email, password) VALUES (?,?,?)`;
        const [insertedUser] = await pool.query(insertUser,[name,email,hash])
        const token = jwt.sign({userId: insertedUser.insertId}, jwt_secret)
        res.cookie("token",token,{
            httpOnly :true,
            secure: true,
            sameSite: 'none',
            path:'/'
        })
        return res.status(200).json({message:"user regestered"})


    } catch (err) {
        return res.status(500).json({ message: "regestration failed", error: err.message });
    }

}


async function loginUser(req, res) {

    try {

        const { email, password } = req.body;
        const checkUser = `SELECT * FROM ${table_name} WHERE email = ?`;
        const [user] = await pool.query(checkUser, [email]);
        if (user.length === 0) return res.status(404).json({ message: "user not found" })
        const hash = await bcrypt.compare(password, user[0].password)
        if (!hash) return res.status(401).json({ message: "wrong credential" });
        const token = jwt.sign({ userId: user[0].userId }, jwt_secret)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })
        return res.status(200).json({ message: "login success" });

    } catch (err) {
        return res.status(500).json({ message: "login failed", error: err.message });
    }

}


function logoutUser(req, res) {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,          // required for HTTPS (Vercel)
            sameSite: "none",      // required for cross-site cookies
            path: "/",
        });
        return res.status(200).json({message:"Logged out"});
    } catch (err) {
        return res.status(500).json({ message: "login failed", error: err.message });
    }
}


module.exports = { registerUser, loginUser, logoutUser };