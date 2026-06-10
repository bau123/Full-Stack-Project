import { useState } from "react";

export default function CategorySidebar({
  categories,
  active,
  onSelect,
  onCreate,
}) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await onCreate({ name: newName.trim(), color: newColor });
    setNewName("");
  }

  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul className="cat-list">
        <li>
          <button
            className={active === null ? "active" : ""}
            onClick={() => onSelect(null)}
          >
            All tasks
          </button>
        </li>
        {categories.map((c) => (
          <li key={c.id}>
            <button
              className={active === c.id ? "active" : ""}
              onClick={() => onSelect(c.id)}
            >
              <span className="dot" style={{ background: c.color }} />
              {c.name}
              <span className="count">{c.task_count}</span>
            </button>
          </li>
        ))}
      </ul>
      <form className="new-cat" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="New category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button type="submit">+</button>
      </form>
    </aside>
  );
}
