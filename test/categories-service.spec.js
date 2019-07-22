const CategoriesService = require('../src/categories/categories-service')
const knex = require('knex')

describe(`Categories service object`, function () {
    let db
    let testCategories = [
        {
            id: 0,
            categoryname: 'Home'
        },
        {
            id: 1,
            categoryname: 'Work'
        },
        {  
            id: 2,
            categoryname: 'School'
        },
    ]
    before(() => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
    })
    after('disconnect from db', () => db.destroy())
    before('clean the table', () => db.raw('TRUNCATE categories, tasks RESTART IDENTITY CASCADE'))
    context(`Given categories has no data`, () => {
        it(`getAllFolders() resolves an empty array`, () => {
            return CategoriesService.getAllCategories(db)
        .then(actual => {
            expect(actual).to.eql([])
            })
        })
        it(`addCategory() inserts a new category and resolves the new category with an 'id'`, () => {
            const newCategory = {
                categoryname: 'Test category'
            }
            return CategoriesService.insertCategory(db, newCategory)
        })
    })

    context(`Given categories has data`, () => {
        beforeEach('clean the table', () => db.raw('TRUNCATE categories, tasks RESTART IDENTITY CASCADE'))
        beforeEach(() => {
            return db
            .into('categories')
            .insert(testCategories)
        })
        it(`Given categories data, resolves all categories from categories table`, () => {
            return CategoriesService.getAllCategories(db)
            .then(actual => {
                 expect(actual).to.eql(testCategories)
            })
        })
      })

})