const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");


const cors = require('cors');
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true                // 👈 allow cookies
}));
app.use(express.json());


const tasks = require('./routes/tasks.routes')
app.use('/api/tasks', tasks)

const auth = require('./routes/auth.routes')
app.use('/api/auth', auth);

app.get('/',(req,res)=>{
  res.send("Server is listening")
})



module.exports = app;