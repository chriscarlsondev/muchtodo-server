const TasksService = {
    getAllTasks(knex){
        return knex.select('*').from('tasks')
    },
    insertTask(knex, newTask) {
        return knex
            .insert(newTask)
            .into('tasks')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
}

module.exports = TasksService