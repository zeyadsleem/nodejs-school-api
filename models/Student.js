// Imports
const { Schema, model } = require('mongoose')

// Student's Schema
const StudentSchema = new Schema({
    name: String,
    birthdate: String,
    city: String,
    email: { type: String, unique: true }
})

// Student's Model
const StudentModel = new model('student', StudentSchema)

module.exports = StudentModel