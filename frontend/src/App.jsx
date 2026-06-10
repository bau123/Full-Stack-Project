import { useEffect, useState } from "react";
import { api } from "./api";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import CategorySidebar from "./components/CategorySidebar.jsx";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState({ next: null, previous: null, count: 0 });

  async function loadAll() {
    try {
      setLoading(true);
      const [t, c] = await Promise.all([
        api.listTasks(activeCategory),
        api.listCategories(),
      ]);
      setTasks(t.results);
      setCategories(c.results);
      setPage({next: t.next, previous: t.previous, count: t.count})
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  async function handleSave(data) {
    if (editing) {
      await api.updateTask(editing.id, data);
    } else {
      await api.createTask(data);
    }
    setEditing(null);
    await loadAll();
  }

  async function handleToggle(task) {
    await api.toggleTask(task.id);
    await loadAll();
  }

  async function handleDelete(task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await api.deleteTask(task.id);
    await loadAll();
  }

  async function handleNext() {

    const t = await api.listTasks(activeCategory, 20, 20)
    setTasks(t.results);
    setPage({next: t.next, previous: t.previous, count: t.count})
  }
  // async function handlePrevious() {
  //   await api.deleteTask(task.id);
  //   await loadAll();
  // }

  async function handleDeleteAll() {
    if (!confirm(`Delete all completed task?`)) return;
    await Promise.all(tasks.filter(task => task.completed).map(task => api.deleteTask(task.id)))
    await loadAll();
  }
  return (
    <div className="app">
      <header className="header">
        <h1>midleveldev</h1>
        <span className="subtitle">A practice task manager</span>
      </header>
      <div className="layout">
        <CategorySidebar
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
          onCreate={async (data) => {
            await api.createCategory(data);
            await loadAll();
          }}
        />
        <main className="main">
          <TaskForm
            key={editing ? editing.id : "new"}
            categories={categories}
            initial={editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
          {error && <div className="error">{error}</div>}
          {tasks.some((task) => task.completed) &&
          <button onClick={handleDeleteAll}>Delete</button>
          }
          {loading ? (
            <div className="muted">Loading...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          )}
          <div>
            <button onClick={() => goTo(page.previous)}>&laquo;</button>
            <button onClick={() => handleNext()}>&raquo;</button>
          </div>
        </main>
      </div>
    </div>
  );
}
