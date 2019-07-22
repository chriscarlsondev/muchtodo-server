const CategoriesService = {
    getAllCategories(knex){
        return knex.select('*').from('categories')
    },
    insertCategory(knex, newCategory) {
        return knex
            .insert(newCategory)
            .into('categories')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
}

module.exports = CategoriesService