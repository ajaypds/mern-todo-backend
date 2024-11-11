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
    }]
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project