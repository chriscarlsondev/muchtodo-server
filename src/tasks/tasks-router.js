const express = require('express')
const uuid = require('uuid/v4')
const bodyParser = express.json()
const logger = require('../logger')
const TasksService = require('./tasks-service')
const xss = require('xss')
const path = require('path')

const tasksRouter = express.Router()


tasksRouter
  .route('/')
  .get((req, res, next) => {
    // Write a route handler for the endpoint GET /tasks that returns a list of tasks
    TasksService.getAllTasks(req.app.get('db'))
    .then(tasks => {
      res.json(tasks)
    })
    .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    // Write a route handler for POST /tasks that accepts a JSON object representing a task and adds it to the list of tasks after validation.
    const { taskname, taskduedate, taskcategory, taskstatus } = req.body
    const newTask = { taskname, taskduedate, taskcategory, taskstatus }

    if (newTask.taskname.length === 0) {
      logger.error(`Task name must be greater than zero`);
      return res.status(400).json({
        error: { message: `Invalid task name submitted` }
      })
    }

    if (newTask.taskstatus !== 'I'  && newTask.taskstatus !== 'C') {
      logger.error(`Task status must be I or C`);
      return res.status(400).json({
        error: { message: `Invalid task status submitted` }
      })
    }

    if (newTask.taskcategory === '') {
      newTask.taskcategory = null;
    }

    if (newTask.taskduedate === '') {
      newTask.taskduedate = null;
    }

    TasksService.insertTask(
    req.app.get('db'),
      newTask
    )
    .then(task => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${task.id}`))
        .json(task)
    })
    .catch(next)
  })

  tasksRouter
  .route('/:id')
  .patch(bodyParser, (req, res, next) => {
    const taskToUpdate = req.params.id;
    TasksService.updateTask(
      req.app.get('db'),
      taskToUpdate
    )
    .then(numRowsAffected => {
    res.status(204).end()
    })
    .catch(next)
  })

module.exports = tasksRouter