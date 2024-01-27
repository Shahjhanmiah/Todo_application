const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


//  Mongodb atals 
mongoose.connect('mongodb://localhost:27017/yourdatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Remove deprecated options
  // usefindandmodify: false,
  // usecreateindex: false,
});


const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// API endpoints
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({ title, description, completed: false });
    await newTask.save();
    console.log(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);
  const { title, description, completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);

  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
