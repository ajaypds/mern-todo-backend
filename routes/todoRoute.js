const express = require('express')
const Todo = require('../model/Todo')
const Project = require('../model/Project')

const router = express.Router();

// Create a new todo
router.post('/todos', async (req, res) => {
    try {
        const parentModel = req.body.parentModel
        const parent = parentModel === 'Project' ? await Project.findById(req.body.parentId) : parentModel === 'Todo' ? await Todo.findById(req.body.parentId) : null
        if (!parent) {
            return res.status(404).json({ message: 'Parent is missing!' })
        }

        const newTodo = new Todo({
            taskname: req.body.taskname,
            duedate: req.body.duedate,
            parent: req.body.parentId,
            parentModel: parentModel
        });
        const savedTodo = await newTodo.save();
        parent.todos.push(savedTodo._id)
        await parent.save()
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Get all todos
router.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get a single todo by ID
router.get('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update a todo by ID
router.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { taskname: req.body.taskname, duedate: req.body.duedate },
            { new: true }
        );
        if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Delete a todo by ID
router.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

