const express = require('express');
const router = express.Router();

const tasks = require('../controller/tasks.controller')

router.get('/', tasks.getTasks)

router.post('/add', tasks.createTask)

router.post('/delete', tasks.deleteTask)

module.exports = router;