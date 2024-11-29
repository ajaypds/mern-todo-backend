const express = require('express')
const Project = require('../model/Project')
const Todo = require('../model/Todo')

const router = express.Router()

//Create a Project
router.post('/projects', async (req, res) => {
    try {
        const newProject = new Project({
            name: req.body.name
        })
        const savedProject = await newProject.save()
        res.status(201).json(savedProject)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get project by id
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('todos');
        if (!project) return res.status(404).json({ message: 'Project not found' })
        res.status(200).json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Generate indexes for all todos
router.put('/projects/generateindex', async (req, res) => {
    try {
        const projects = await Project.find()

        for (const project of projects) {
            if (project.todos.length > 0) {
                var index = 1
                for (const id of project.todos) {
                    await Todo.findByIdAndUpdate(id, { index: index });
                    index += 1;
                }
            }
        };
        res.status(200).json({ message: 'Success!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update project
router.put('/projects/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        if (!updatedProject) return res.status(404).json({ message: 'Project not found!' })
        res.status(200).json(updatedProject)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Delete a project
router.delete('/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found!' })
        res.status(200).json({ message: 'Project deleted!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router