const {Schema, model} = require('mongoose');

const todoSchema = new Schema({
        text: {
            type: String, required: true
        },
        isDone: {
            type: Boolean, required: true
        }
    },
    {versionKey: false})

module.exports = model('todos', todoSchema);