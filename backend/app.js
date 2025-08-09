const express = require('express')
const dotenv = require('dotenv')
const Task = require('./models/task')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

dotenv.config()
app.use(express.json())
app.use(cors())

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

app.get('/tasks', async (req, res) => {
    try {
        const data = await Task.find()
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
        const { title, description } = req.body
        if (!title) {
            return res.status(400).json({ error: 'title required' })
        }
        const task = await Task.create({
            title,
            description: description || '',
            completed: false
        })
        res.status(201).json(task)
    } catch (err) {
        res.status(500).json({ error: 'failed to create task', detail: err.message })
    }
})

app.put('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { title, description, completed } = req.body
        if (!title) {
            return res.status(400).json({ error: 'title required' })
        }
        const task = await Task.findByIdAndUpdate(id, {
            title,
            description: description || '',
            completed: completed ? completed : undefined
        }, { new: true, runValidators: true })
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

const PORT = process.env.PORT || 3000
connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`)
    })
})
    .catch(() => {
        console.log('Error on startup')
    })