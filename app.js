require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const dburi = process.env.DBURI

mongoose.connect(dburi)
    .then((result) => app.listen(3005, () => console.log('Server is running on port 3005')))
    .catch((error) => console.log(error))

app.get('/', (req, res) => {
    res.status(200).send({ message: "Server is running!" })
})