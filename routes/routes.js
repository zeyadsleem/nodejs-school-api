// Imports
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const TeacherModel = require('../models/Teacher')
const StudentModel = require('../models/Student')
const hashPassword = require('../helpers')

const setUpRoutes = (app) => {
    // GET
    app.get('/students', async (req, res) => {
        try {
            // Checking if the user has permission
            const token = req.headers.authorization
            if(!token) {
                res.statusCode = 401
                res.send('No Permission')
                return
            }
            // Checking if there even is a User
            const decodedToken = jwt.decode(token)
            const user = await TeacherModel.findById(decodedToken.sub)
            if(!user) {
                res.statusCode = 401
                res.send('No Permission')
                return
            }
            jwt.verify(token, user.salt)
        } catch (err) {
            res.statusCode = 401
            res.send(err.message)
        }

        // Getting the list of students from DataBase
        const students = await StudentModel.find({})
        res.send(students)
    })

    app.get('*', (req, res) => {
        res.send('Url Not Found')
    })

    // POST
    // Student Register
    app.post('/student/register', async (req, res) => {
        const { name, birthdate, city, email } = req.body
        const bodySchema = Joi.object({
            email: Joi.string().email().required(),
            name: Joi.string().required(),
            birthdate: Joi.string().required(),
            city: Joi.string().required()
        })

        const validationResult = bodySchema.validate(req.body)
        if (validationResult.error) {
            res.statusCode = 400
            res.send(validationResult.error.details[0].message)
            return
        }

        try {
            const newStudent = new StudentModel({
                name,
                birthdate,
                city,
                email
            })
            await newStudent.save()
            res.send(newStudent)
        } catch (err) {
            res.statusCode = 400
            res.send(err.message)
        }
    })

    // Teacher Register/Login
    app.post('/teacher/register', async (req, res) => {
        const { name, birthdate, password, email } = req.body
        const bodySchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            name: Joi.string().required(),
            birthdate: Joi.string().required()
        })

        const validationResult = bodySchema.validate(req.body)
        if (validationResult.error) {
            res.statusCode = 400
            res.send(validationResult.error.details[0].message)
            return
        }

        try {
            const newTeacher = new TeacherModel({
                name,
                birthdate,
                password,
                email
            })
            await newTeacher.save()
            res.send(newTeacher)
        } catch (err) {
            res.statusCode = 400
            res.send(err.message)
        }
    })

    app.post('/teacher/login', async (req, res) => {
        const { email, password } = req.body
        const teacher = await TeacherModel.find({email})

        if (!teacher) {
            res.statusCode = 401
            res.send('No User Found')
        } else {
            if (teacher[0].password === hashPassword(password, teacher[0].salt)) {
                const token = jwt.sign({sub: teacher[0]._id,}, "" + teacher[0].salt, {expiresIn: 30000000})
                res.send(token)
            } else {
                res.statusCode = 403
                res.send('Incorrect Password')
            }
        }
    })

    // PUT
    app.put('/student/:id', async (req, res) => {
        const { id } = req.params
        const student = await StudentModel.findById(id)
        
        if (!student) {
            res.statusCode = 400
            res.send('UserID Incorrect')
        } else {
            const { birthdate, city, name, email } = req.body
            if (birthdate) {
                student.birthdate = birthdate
                student.save()
                res.send(student)
            } else if (city) {
                student.city = city
                student.save()
                res.send(student)
            } else if (name) {
                student.name = name
                student.save()
                res.send(student)
            } else if (email) {
                student.email = email
                student.save()
                res.send(student)
            }
        }
        res.end()
    })

    // DELETE
    app.delete('/delete/:id', async (req, res) => {
        const { id } = req.params
        const student = await StudentModel.deleteOne({_id: id})
        res.send('Successfully Deleted')
    })
}

module.exports = setUpRoutes