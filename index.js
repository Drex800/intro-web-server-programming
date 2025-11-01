const express = require("express");
const app = express();
app.use(express.json());

// 🗂 Base de datos simulada
let tasks = [];
let nextId = 1;

// ✅ GET /tasks — listar todas las tareas o filtrar por estado
app.get("/tasks", (req, res) => {
  const { status } = req.query;
  if (status) {
    const filtered = tasks.filter(t => t.status === status);
    return res.json(filtered);
  }
  res.json(tasks);
});

// ✅ GET /tasks/summary — debe ir ANTES que /tasks/:id
app.get("/tasks/summary", (req, res) => {
  const summary = { todo: 0, doing: 0, done: 0 };

  tasks.forEach(t => {
    if (t && typeof t.status === "string") {
      const key = t.status.toLowerCase();
      if (summary[key] !== undefined) summary[key]++;
    }
  });

  res.json(summary);
});

// ✅ GET /tasks/:id — obtener una tarea específica
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// ✅ POST /tasks — crear una nueva tarea
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

// ✅ PUT /tasks/:id — actualizar todos los campos
app.put("/tasks/:id", (req, res) => {
  const { title, description, status } = req.body;
  const validStatuses = ["todo", "doing", "done"];

  if (!title || !description || !status) {
    return res
      .status(400)
      .json({ message: "Fields 'title', 'description', and 'status' are required" });
  }

  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status value. Must be 'todo', 'doing', or 'done'." });
  }

  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = title;
  task.description = description;
  task.status = status;

  res.json(task);
});

// ✅ PATCH /tasks/:id/status — actualizar solo el estado
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

// ✅ DELETE /tasks/:id — eliminar tarea
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
});

// 🚀 Servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
