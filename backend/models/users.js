const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.password 
        return ret
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User