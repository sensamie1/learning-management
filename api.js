const express = require('express');

const userRouter = require('./users/users-router');

require('dotenv').config();

const app = express();

app.use(express.json()) // body parser

app.use('/api/v1/users', userRouter)




// home route
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Learning Path Management!', status: true })
})


app.get('/{*any}', (req, res) => {
  return res.status(404).json({
    data: null,
    error: 'Route not found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    data: null,
    error: 'Server Error'
  })
})

module.exports = app;