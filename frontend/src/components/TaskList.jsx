export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <div className="muted">No tasks yet — add one above.</div>;
  }
  return (
    <ul className="task-list">
      {tasks.map((task) => {
        function todayLocalISO() {
          const d = new Date();
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        }
        const isOverdue = task.due_date && !task.completed && task.due_date < todayLocalISO();
        return (
        <li
          key={task.id}
          className={`task-item priority-${task.priority} ${task.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
          />
          <div className="task-body">
            <div className="task-title">{task.title}</div>
            {task.description && (
              <div className="task-desc">{task.description}</div>
            )}
            <div className="task-meta">
              {task.category_name && (
                <span
                  className="chip"
                  style={{ background: task.category_color }}
                >
                  {task.category_name}
                </span>
              )}
              <span className="chip priority">{task.priority}</span>
              {!task.completed &&
              <span className={`chip ${isOverdue ? "duelate" : "due"}`}>due {task.due_date}</span>
              }
            </div>
          </div>
          <div className="task-actions">
            <button onClick={() => onEdit(task)}>Edit</button>
            <button className="danger" onClick={() => onDelete(task)}>
              Delete
            </button>
          </div>
        </li>
        )
})}
    </ul>
  );
}
