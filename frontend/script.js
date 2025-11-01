const API_URL = "http://localhost:3000/tasks";

const list = document.getElementById("task-list");
const addBtn = document.getElementById("add-task");

// 📋 Obtener tareas
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong> - ${task.description} 
      [<em>${task.status}</em>]
      <button onclick="deleteTask(${task.id})">🗑️</button>
      <button onclick="markDone(${task.id})">✅</button>
    `;
    list.appendChild(li);
  });
}

// ➕ Agregar tarea
addBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  loadTasks();
});

// ❌ Eliminar tarea
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

// ✅ Cambiar estado a “done”
async function markDone(id) {
  await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "done" }),
  });
  loadTasks();
}

// 🔄 Cargar al iniciar
loadTasks();
