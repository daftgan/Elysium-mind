const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Stockage en mémoire
let tasks = [
  {
    id: 'task_0',
    label: 'Première tâche',
    status: 'À faire',
    priority: 'Moyenne',
  },
];
let edges = [];

// GET toutes les tâches et liens
app.get('/tasks', (req, res) => {
  res.json({ tasks, edges });
});

// POST nouvelle tâche
app.post('/tasks', (req, res) => {
  const { id, label, status, priority } = req.body;
  tasks.push({ id, label, status, priority });
  res.status(201).json({ success: true });
});

// PUT mise à jour d'une tâche
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { label, status, priority } = req.body;
  tasks = tasks.map((t) => (t.id === id ? { ...t, label, status, priority } : t));
  res.json({ success: true });
});

// DELETE une tâche
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== id);
  edges = edges.filter((e) => e.source !== id && e.target !== id);
  res.json({ success: true });
});

// GET tous les liens
app.get('/edges', (req, res) => {
  res.json(edges);
});

// POST nouveau lien
app.post('/edges', (req, res) => {
  const { id, source, target } = req.body;
  edges.push({ id, source, target });
  res.status(201).json({ success: true });
});

// DELETE un lien
app.delete('/edges/:id', (req, res) => {
  const { id } = req.params;
  edges = edges.filter((e) => e.id !== id);
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 