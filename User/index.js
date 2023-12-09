const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { connect } = require('nats');
const { CreateUser, DeleteUser, ReadUsers, ReadOwnData } = require('./controllers/admin.controllers');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://swaraj1920:swaraj1920@cluster0.6yd9l.mongodb.net/taskmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const natsOptions = {
  servers: ['nats://localhost:4222'],
};

const handleTaskCompletedEvent = (msg) => {
  const eventData = JSON.parse(msg.data);
  console.log(`User ${eventData.userId} completed task ${eventData.taskId} at ${eventData.completedAt}`);
};

const subscribeToTaskCompletedEvent = async () => {
  try {
    const nc = await connect(natsOptions);
    console.log('Connected to NATS server.');
    const subscription = nc.subscribe('TASK_COMPLETED', (err, msg) => {
      try {
        handleTaskCompletedEvent(msg);
        console.log('Received TASK_COMPLETED event');
      } catch (error) {
        console.error('Error handling TASK_COMPLETED event:', error);
      }
    });
    // subscription.unsubscribe();
  } catch (error) {
    console.error('Error connecting to NATS server:', error);
  }
};

subscribeToTaskCompletedEvent().catch((err) => {
  console.error('Error:', err.message);
});


app.post('/createUser', CreateUser);

app.delete('/deleteUser', DeleteUser);

app.get('/readUsers', ReadUsers);

app.post('/readOwnData', ReadOwnData);

app.listen(port, () => {
  console.log(`User Microservice listening at ${port}`);
});


module.exports = app;