const express = require('express');
const Task = require('../models/Task');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes here require auth
router.use(requireAuth);

// GET /api/tasks (with optional search, pagination, sort)
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {
      user: req.user.id,
      ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
    };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Task.countDocuments(query),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
});

// GET /api/tasks/stats
router.get('/stats', async (req, res) => {
  try {
    const [pending, completed] = await Promise.all([
      Task.countDocuments({ user: req.user.id, status: 'Pending' }),
      Task.countDocuments({ user: req.user.id, status: 'Completed' }),
    ]);
    res.json({ pending, completed });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats', error: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description = '', dueDate = null, priority = 'Medium', status = 'Pending' } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const task = await Task.create({ user: req.user.id, title, description, dueDate, priority, status });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get task', error: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = (({ title, description, dueDate, priority, status }) => ({ title, description, dueDate, priority, status }))(req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'Completed' },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark complete', error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

module.exports = router;