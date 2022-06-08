// Imports
const { Schema, model } = require('mongoose')
const shortId = require('shortid')
const hashPassword = require('../helpers')

// Teacher's Schema
const TeacherSchema = new Schema({
    name: String,
    birthdate: String,
    password: String,
    email: { type: String, unique: true },
    salt: String
})

TeacherSchema.pre('save', async function(next) {
    this.salt = shortId.generate()
    this.password = await hashPassword(this.password, this.salt)
})

// Teacher's Model
const TeacherModel = new model('teacher', TeacherSchema)
module.exports = TeacherModel