const TasksService = require('../src/tasks/tasks-service')
const knex = require('knex')

describe(`Tasks service object`, function () {
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
    let testTasks = [
        {
            id: 0,
            taskname: 'Do homework',
            taskstatus: 'I',
            taskcategory: 1
        }
    ]
    before(() => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
    })
    after('disconnect from db', () => db.destroy())
    before('clean the table', () => db.raw('TRUNCATE categories, tasks RESTART IDENTITY CASCADE'))
    context(`Given tasks has no data`, () => {
        it(`getAllTasks() resolves an empty array`, () => {
            return TasksService.getAllTasks(db)
        .then(actual => {
            expect(actual).to.eql([])
            })
        })
    })

    context(`Given categories has data`, () => {
        beforeEach('clean the table', () => db.raw('TRUNCATE categories, tasks RESTART IDENTITY CASCADE'))
        beforeEach(() => {
            return db
                .into('categories')
                .insert(testCategories)
        })
        it(`insertTask() inserts a new task and resolves the new task with an 'id'`, () => {
            const newTask = {
                id: 0,
                taskname: 'Do homework',
                taskstatus: 'I',
                taskcategory: 1,
                taskduedate: null
            }
            return TasksService.insertTask(db, newTask)
        })
    })

    context(`Given categories and tasks has data`, () => {
        beforeEach('clean the table', () => db.raw('TRUNCATE categories, tasks RESTART IDENTITY CASCADE'))
        beforeEach(() => {
            return db
            .into('categories')
            .insert(testCategories)
        })
        beforeEach(() => {
            return db
            .into('tasks')
            .insert(testTasks)
        })
        it(`updateTask() updates a task from the tasks table`, () => {
            const idOfTaskToUpdate = 0
            return TasksService.updateTask(db, idOfTaskToUpdate)
                .then(() => TasksService.getAllTasks(db))
                .then(allNotes => {
                    // copy the test notes array without the "deleted" note
                    expected = [
                        {
                            id: 0,
                            taskname: 'Do homework',
                            taskstatus: 'C',
                            taskcategory: 1,
                            taskduedate: null
                        }
                    ]
                    expect(allNotes).to.eql(expected)
                })
        })
    })

})