require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const todoRoutes = require('./routes/todoRoute')
const projectRoutes = require('./routes/projectRoute')

const app = express()
app.use(cors())
app.use(express.json())

const dburi = process.env.DBURI
const port = process.env.PORT || 5000

mongoose.connect(dburi)
    .then((result) => app.listen(port, () => console.log(`Server is running on port ${port}`)))
    .catch((error) => console.log(error))

app.get('/', (req, res) => {
    res.status(200).send({ message: "Server is running!" });
})

app.use('/api', todoRoutes);
app.use('/api', projectRoutes);