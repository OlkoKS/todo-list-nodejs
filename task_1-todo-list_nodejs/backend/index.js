const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const TodosModel = require('./todo.model');
const handleError = require('./helpers');

require('dotenv').config();
const {DB_HOST, PORT = 3002} = process.env;

mongoose.connect(DB_HOST)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log(error.message)
    })

const app = express();

app.listen(PORT, () => {
    console.log('Server is running...');
})
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('<h1>HW 23 "Node.js"</h1>');
})
app.get('/todos', (req, res) => {
    TodosModel.find().then(response => res.send(response)).catch(handleError);
})
app.post('/todos', (req, res) => {
    const newTodo = new TodosModel(req.body);
    // console.log(newTodo);
    newTodo.save().then(response => res.send(response)).catch(handleError);
})
app.put('/todos/:id', (req, res) => {
    const id = req.params.id;

    TodosModel.updateOne({_id: id}, req.body)
        .then(response => {
            res.status(200).send({message: 'Success', data: response})
        })
        .catch(handleError);
})
app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    TodosModel.deleteOne({_id: id})
        .then(response => {
            if (response.deletedCount === 0) {
                res.status(404).send({message: 'Error!'})
            } else {
                res.status(200).send({message: 'Success!'})
            }
        })
        .catch(handleError);
})