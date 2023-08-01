const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());   /// helps to handle res.json() data coming inside the body
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://riteshkshik:Ri686313@cluster0.kas7p2e.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected To DB"))
  .catch(console.error);

const Todo = require('./models/Todo');

app.get('/todos', async (req, res) =>{
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todo/new', (req, res) =>{
    const newTodo = new Todo({
        text: req.body.text
    });
    // return;
    newTodo.save();
    res.json(newTodo);
});

app.delete('/todo/delete/:id', async (req, res) =>{
    const deleted_todo = await Todo.findByIdAndDelete(req.params.id);
    res.json(deleted_todo);
});

app.put('/todo/complete/:id', async (req, res) =>{
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
})

app.listen(3001, () => console.log("Server Started on Port 3001"));