// Imports
const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const setUpRoutes = require('./routes/routes')

const start = async () => {
    try {
        // Connecting to DataBase
        await mongoose.connect('mongodb://localhost/schoolproject', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to DB')

        // Creating App
        const app = express()
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
        console.log(`App created`)

        setUpRoutes(app)
        app.listen(4000)
        console.log('Routes added, listen on port 4000')
    } catch (err) {
        console.error(err)
    }
}
start()