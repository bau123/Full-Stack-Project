const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listTasks: (categoryId, offset) => {
    const params = new URLSearchParams();
    if (categoryId){
      params.set('category', categoryId)
    }
      params.set('limit', 20)
    if (offset){
      params.set('offset', offset)
    }
    const qs = params.toString();
    return request(`/tasks/${qs ? `?${qs}` : ''}`);
  },
  listTasksNext: (next) => {
    return request(next);
  },
  createTask: (data) =>
    request(`/tasks/`, { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id, data) =>
    request(`/tasks/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}/`, { method: "DELETE" }),
  toggleTask: (id) => request(`/tasks/${id}/toggle/`, { method: "POST" }),
  listCategories: () => request(`/categories/`),
  createCategory: (data) =>
    request(`/categories/`, { method: "POST", body: JSON.stringify(data) }),
};
