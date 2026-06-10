import { useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  priority: "medium",
  due_date: "",
};

export default function TaskForm({ categories, initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          description: initial.description || "",
          category: initial.category || "",
          priority: initial.priority,
          due_date: initial.due_date || "",
        }
      : emptyForm,
  );
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        category: form.category || null,
        due_date: form.due_date || null,
      });
      if (!initial) setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Task title..."
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={form.priority}
          onChange={(e) => update("priority", e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={form.due_date}
          onChange={(e) => update("due_date", e.target.value)}
        />
      </div>
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {initial ? "Save changes" : "Add task"}
        </button>
        {initial && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
