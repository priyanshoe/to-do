const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");


const cors = require('cors');
app.use(cors({
  origin: [
    "http://localhost:3000", // frontend URL
    process.env.ACCESS_URL
  ],
  credentials: true                // 👈 allow cookies
}));
app.use(cookieParser());
app.use(express.json());


const tasks = require('./routes/tasks.routes')
app.use('/api/tasks', tasks)

const auth = require('./routes/auth.routes')
app.use('/api/auth', auth);



module.exports = app;