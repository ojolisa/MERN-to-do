const express = require('express')
const dotenv = require('dotenv')
const Task = require('./models/task')
const User = require('./models/users')
const cors = require('cors')
const mongoose = require('mongoose')
const { GoogleGenAI } = require('@google/genai')
const bcrypt = require('bcrypt')

const app = express()

dotenv.config()
app.use(express.json())
app.use(cors())

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

async function connect() {
    await mongoose.connect(process.env.MONGO_URI, {
        autoIndex: true
    })
    console.log('Mongo connected')
}

app.get('/', (req, res) => {
    try {
        res.json({
            'message': 'api running'
        })
    } catch {
        res.json({ error: 'failed to start api' })
    }
})

app.get('/:userId/tasks', async (req, res) => {
    try {
        const { userId } = req.params
        const data = await Task.find({ userId })
        res.status(200).json(data)
    }
    catch {
        res.status(500).json({ error: 'failed to get tasks' })
    }
})

app.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json({ error: 'task not found' })
        }
        res.status(200).json(task)
    } catch (err) {
        res.status(500).json({ error: 'failed to get task', detail: err.message })
    }
})

app.post('/tasks', async (req, res) => {
    try {
        const { title, description, priority, dueDate, userId } = req.body
        if (!title || !userId) {
            return res.status(400).json({ error: 'title and userId are required' })
        }
        const task = await Task.create({
            title,
            description: description || '',
            completed: false,
            priority: priority || 'low',
            dueDate: dueDate || null,
            userId: userId
        })
        res.status(201).json(task)
    } catch (err) {
        res.status(500).json({ error: 'failed to create task', detail: err.message })
    }
})

app.put('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { title, description, completed, priority, dueDate } = req.body
        if (!title) {
            return res.status(400).json({ error: 'title required' })
        }
        const updateData = {
            title,
            description: description || '',
            priority: priority || 'low',
            dueDate: dueDate || null
        }

        if (completed !== undefined) {
            updateData.completed = completed
        }

        const task = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        res.status(200).json(task)
    } catch (err) {
        res.status(500).json({ error: 'failed to update task', detail: err.message })
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
            return res.status(404).json({ error: 'task not found' })
        }
        res.status(200).json({ 'message': 'deleted' })
    } catch (err) {
        res.status(500).json({ error: 'failed to delete task', detail: err.message })
    }
})

app.get('/:userId/ai/summary', async (req, res) => {
    try {
        const { userId } = req.params
        const tasks = await Task.find({ userId })
        const prompt = "You are a helpful personal assistant. Address the user in second person. Summarize the following tasks: " + tasks.map(task => task.title + " - " + task.description + ' - ' + (task.completed ? 'completed' : 'pending') + ' - ' + task.priority + ' - ' + (task.dueDate ? task.dueDate : 'no due date')).join(", ")
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            }
        });
        res.status(200).json({
            summary: response.text
        })
    } catch (err) {
        res.status(500).json({ error: 'failed to generate summary', detail: err.message })
    }
})

app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email and password are required' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ error: 'failed to create user', detail: err.message })
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email and password are required' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword }, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).json({ error: 'user not found' })
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: 'failed to update user', detail: err.message })
    }
})

app.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' })
        }
        const user = await User.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'invalid email or password' })
        }
        res.status(200).json({ userId: user._id, message: 'authentication successful' })
    } catch (err) {
        res.status(500).json({ error: 'failed to authenticate user', detail: err.message })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ error: 'user not found' })
        }
        res.status(200).json({ message: 'user deleted' })
    } catch (err) {
        res.status(500).json({ error: 'failed to delete user', detail: err.message })
    }
})

const PORT = process.env.PORT || 3000
connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`)
    })
})
    .catch(() => {
        console.log('Error on startup')
    })