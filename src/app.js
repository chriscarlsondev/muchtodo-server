require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const winston = require('winston');
const tasksRouter = require('./tasks/tasks-router')
const categoriesRouter = require('./categories/categories-router')
const logger = require('./logger')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))
  
app.use(cors());
// app.use(
//     cors({
//         origin: CLIENT_ORIGIN
//     })
// );

app.use(helmet())
app.use(express.json());
  
app.use('/api/tasks',tasksRouter)
app.use('/api/categories',categoriesRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app