const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    taskname: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: false
    },
    id: {
        type: Number,
        required: false
    },
    duedate: {
        type: Date,
        required: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        refPath: 'parentModel',
        required: true
    },
    parentModel: {
        type: String,
        required: true,
        enum: ['Project', 'Todo']
    },
    todos: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }]
})

//middleware to check duplicate todo before saving

todoSchema.pre('save', async function (next) {
    const todo = this;
    const parentModel = mongoose.model(todo.parentModel);
    const parent = await parentModel.findById(todo.parent).populate('todos');

    if (parent.todos.some(existingTodo => {
        if (existingTodo.taskname === todo.taskname && !existingTodo._id.equals(todo._id)) {
            return true
        }
    })) {
        const error = new Error('Todo already exists!');
        return next(error);
    }
    if (this.isNew) {
        todo.id = parent.todos.length + 1
    }
    next();
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo