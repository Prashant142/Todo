const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
mongoose.set('strictQuery', true);
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection 
mongoose.connect(process.env.URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Database connected sucessfully");
}).catch(console.error);

const Todo = require('./Model/Todo');
// Get all the data.
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Add or Post the data into the DB.
app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save();
    res.json(todo);
});

// Delete any data using uniqure ID.
app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json({result});
});

// Put req to initialise that a tast has been completed or not.
// app.get('/todo/complete/:id', async (req, res) => {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) {
//         return res.status(404).json({message: 'Todo not found'});
//     }
//     todo.complete = !todo.complete;
//     todo.save();
//     res.json(todo);
// });


// Post Listening 
app.listen(5000, () => {
    console.log("Server connect sucessfullt, Port listening on PORT//:5000");
})

