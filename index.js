// index.js
const express = require("express");
const app = express();
app.use(express.json());

// Simulación de base de datos en memoria
let tasks = [];
let nextId = 1;

// ✅ GET /tasks — obtiene todas las tareas (permite filtrar por estado)
app.get("/tasks", (req, res) => {
  const { status } = req.query;
  if (status) {
    const filtered = tasks.filter(t => t.status === status);
    return res.json(filtered);
  }
  res.json(tasks);
});

// ✅ GET /tasks/:id — obtiene una tarea por ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// ✅ POST /tasks — crea una nueva tarea (status por defecto: "todo")
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTask = {
    id: nextId++,
    title,
    description: description || "",
    status: "todo",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ✅ PUT /tasks/:id — actualiza completamente una tarea
app.put("/tasks/:id", (req, res) => {
  const { title, description, status } = req.body;
  const validStatuses = ["todo", "doing", "done"];
  if (!title || !description || !status) {
    return res.status(400).json({ message: "All fields (title, description, status) are required" });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks[index] = { id: tasks[index].id, title, description, status };
  res.json(tasks[index]);
});

// ✅ PATCH /tasks/:id/status — cambia solo el estado de una tarea
app.patch("/tasks/:id/status", (req, res) => {
  const { status } = req.body;
  const validStatuses = ["todo", "doing", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = status;
  res.json({ id: task.id, status: task.status });
});

// ✅ DELETE /tasks/:id — elimina una tarea por ID
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
});

// ✅ GET /tasks/summary — retorna resumen de tareas por estado
app.get("/tasks/summary", (req, res) => {
  const summary = { todo: 0, doing: 0, done: 0 };
  tasks.forEach(t => {
    if (summary[t.status] !== undefined) summary[t.status]++;
  });
  res.json(summary);
});

// 🚀 Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
