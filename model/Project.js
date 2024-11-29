const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    todos: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    completedTodos: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

projectSchema.virtual('completedTasks').get(function () {
    console.log(`completed todos: ${this.completedTodos}`)
    return this.completedTodos.length
})

projectSchema.virtual('incompleteTasks').get(function () {
    return (this.todos.length - this.completedTodos.length)
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project