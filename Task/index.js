const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { CreateTask, UpdateTask, SortSearch, ReadOwnTasks, MarkTaskAsComplete, AssignTaskToUser, CompleteTask } = require('./controllers/task.controllers');

const app = express();
const port = 3001;
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://swaraj1920:swaraj1920@cluster0.6yd9l.mongodb.net/taskmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/createTask', CreateTask);

app.post('/updateTask', UpdateTask);

app.post('/sortSearch', SortSearch)

app.post('/readOwnTasks', ReadOwnTasks);

app.post('/markTaskAsComplete', MarkTaskAsComplete);

app.post('/assignTaskToUser', AssignTaskToUser);

app.post('/tasks/complete', CompleteTask);

app.listen(port, () => {
    console.log(`Task Microservice listening at ${port}`);
});
