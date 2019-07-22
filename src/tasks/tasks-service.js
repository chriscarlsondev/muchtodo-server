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
    updateTask(knex, id) {
        return knex('tasks')
            .where( 'id', id )
            .update({
                'taskstatus': 'C'
            })
    },
}

module.exports = TasksService