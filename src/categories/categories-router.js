const express = require('express')
const uuid = require('uuid/v4')
const categoriesRouter = express.Router()
const bodyParser = express.json()
const logger = require('../logger')
const CategoriesService = require('./categories-service')
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()

categoriesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    // Write a route handler for the endpoint GET /api/categories that returns a list of categories
    CategoriesService.getAllCategories(knexInstance)
    .then(tasks => {
      res.json(tasks)
    })
    .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    // Write a route handler for POST /api/categories that accepts a JSON object representing a categories and adds it to the list of categories after validation.
    const { categoryname } = req.body
    const newCategory = { categoryname }

    for (const [key, value] of Object.entries(newCategory)) {
      if (value == null) {
        logger.error(`New category submission did not include all required fields`);
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    if (newCategory.categoryname.length === 0) {
      logger.error(`Category name must be greater than zero`);
      return res.status(400).json({
        error: { message: `Invalid category submitted` }
      })
    }

    CategoriesService.insertCategory(
    req.app.get('db'),
      newCategory
    )
    .then(category => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${category.id}`))
        .json(category)
    })
    .catch(next)
  })

module.exports = categoriesRouter