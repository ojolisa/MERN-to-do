const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000
        },
        completed: {
            type: Boolean,
            default: false,
            index: true
        },
        dueDate: {
            type: Date
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
            index: true
        }
    },
    {
        timestamps: true
    }
)

// Useful compound index for listing upcoming incomplete tasks
TaskSchema.index({ completed: 1, dueDate: 1 })

// Clean JSON output
TaskSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        return ret
    }
})

module.exports = mongoose.model('Task', TaskSchema)