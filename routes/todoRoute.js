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

// generate id field
router.get('/todos/generateid', async (req, res) => {
    try {
        const todos = await Todo.find();
        for (const todo of todos) {
            todo.id = todo.index
            console.log(todo)
            await todo.save()
        }
        const response = await Todo.find()
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

// Update index
router.put('/todos', async (req, res) => {
    try {
        // activeId, activeIndex, overId, overIndex
        const activeTodo = await Todo.findByIdAndUpdate(
            req.body.activeId,
            { id: req.body.overIndex },
            { new: true }
        );
        const overTodo = await Todo.findByIdAndUpdate(
            req.body.overId,
            { id: req.body.activeIndex },
            { new: true }
        );
        if (!activeTodo && !overTodo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ activeTodo, overTodo });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Todo Order
router.put('/todos/updateOrder', async (req, res) => {
    try {
        const order = [...req.body.order]
        if (!order && !order.length > 0) {
            res.status(404).json({ message: "order cannot be blank!" })
        }
        for (var i = 0; i < order.length; i++) {
            await Todo.findByIdAndUpdate(
                order[i],
                { id: i + 1 }
            )
        }
        res.status(200).json({ order, message: "Order updated successfully!" });
    } catch (err) {
        res.status(400).json({ message: err.message });
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

