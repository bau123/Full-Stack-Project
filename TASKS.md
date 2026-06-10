# Practice Tasks

A set of exercises tuned to mid-level work in this codebase. Each task is **independent** — you don't need to do them in order. Each lists where the relevant code lives, what to change, and how to know you're done.

Suggested order: **warm-ups → backend → frontend → cross-stack → stretch**. Don't try to do them all in one sitting.

---

## Warm-ups (~15–30 min each)

### 1. Add a "Clear completed" button - DONE
- **Where:** `frontend/src/App.jsx`, `frontend/src/components/TaskList.jsx`
- **What:** Add a button above the task list that deletes all completed tasks in the current view. Confirm with the user before deleting.
- **Done when:** Button is visible only when at least one completed task exists; clicking it removes them and refreshes the list.

### 2. Sort tasks by due date, then priority - DONE
- **Where:** `backend/tasks/models.py` (`Meta.ordering`) **or** `backend/tasks/views.py` (`get_queryset`)
- **What:** Default ordering currently goes by `-created_at`. Change it so tasks are sorted by `due_date` ascending (nulls last), with `priority` (high → low) as the tiebreaker.
- **Done when:** Reloading `/api/tasks/` returns the expected order. Bonus: do it at the DB level, not in Python.

### 3. Show an "overdue" badge - done
- **Where:** `frontend/src/components/TaskList.jsx`, `frontend/src/styles.css`
- **What:** If a task's `due_date` is in the past and it isn't completed, render a red "Overdue" chip next to the due date.
- **Done when:** Past-due, incomplete tasks visibly show the badge; completed past-due tasks don't.

---

## Backend (~30–60 min each)

### 4. Fix the N+1 query in the task list endpoint
- **Where:** `backend/tasks/views.py` → `TaskViewSet.get_queryset`
- **Symptom:** The serializer reads `category.name` and `category.color` for each task. With many tasks, this issues one extra query per task.
- **What:** Use `select_related("category")` so the join happens once.
- **Done when:** Use Django Debug Toolbar, `django.db.connection.queries`, or a logging trick to confirm the list endpoint runs a constant number of queries regardless of task count. Write a quick comment in your PR description showing before/after query counts.

### 5. Add pagination to the tasks endpoint
- **Where:** `backend/config/settings.py` (`REST_FRAMEWORK`), `backend/tasks/views.py`, `frontend/src/api.js`, `frontend/src/App.jsx`
- **What:** Switch the tasks endpoint to use DRF's `PageNumberPagination` with `PAGE_SIZE = 20`. Update the React app to:
  - Read `results`, `next`, `previous`, `count` from the response.
  - Render simple "Prev / Next" controls.
- **Done when:** With >20 seeded tasks, you can page through and the URL updates. Make sure the category filter still works.

### 6. Add server-side search
- **Where:** `backend/tasks/views.py`, `frontend/src/App.jsx`, `frontend/src/api.js`
- **What:** Support `?search=<text>` on `/api/tasks/`. Match `title` and `description` case-insensitively. Add a search input in the header.
- **Done when:** Typing in the search box (debounced, ~250 ms) filters results live. Empty search returns everything. Bonus: prevent racing requests when typing fast.

### 7. Add a `bulk_complete` endpoint
- **Where:** `backend/tasks/views.py`
- **What:** Add `POST /api/tasks/bulk_complete/` that accepts `{"ids": [1,2,3]}` and marks each task completed in a single query (`update(completed=True)`). Return the count of tasks updated.
- **Done when:** Endpoint exists, returns `{"updated": N}`, runs as one UPDATE statement, and validates `ids` is a list of integers.

### 8. Write tests for the Task API
- **Where:** create `backend/tasks/tests/test_api.py`
- **What:** Using DRF's `APIClient`, cover:
  - Create returns 201 and persists.
  - List filter by category returns only that category's tasks.
  - Toggle endpoint flips `completed`.
  - PATCH updates only specified fields.
- **Done when:** `python3 manage.py test tasks` passes, with ≥4 tests, and they run in <1 s.

---

## Frontend (~30–60 min each)

### 9. Replace `confirm()` with a real modal
- **Where:** `frontend/src/App.jsx` (delete flow)
- **What:** Build a small `<ConfirmDialog />` component (no library) for delete confirmation. Trap focus while open, support Esc to close.
- **Done when:** Deleting a task shows your modal, not the browser dialog. Keyboard works correctly.

### 10. Optimistic toggle
- **Where:** `frontend/src/App.jsx` → `handleToggle`
- **What:** Currently we wait for the API round-trip before updating the UI. Switch to optimistic update: flip the checkbox state immediately, then revert on error.
- **Done when:** Toggling feels instant. Kill the backend, toggle once, confirm the UI rolls back and shows an error.

### 11. Extract a custom hook
- **Where:** `frontend/src/App.jsx` (the load/error/loading logic)
- **What:** Pull the data loading out into a `useTasks(activeCategory)` hook in `frontend/src/hooks/useTasks.js`. Keep mutations in `App.jsx`.
- **Done when:** `App.jsx` is shorter, the hook handles refetch on category change, and behavior is unchanged.

### 12. Replace the form's prop-drilling with `useReducer`
- **Where:** `frontend/src/components/TaskForm.jsx`
- **What:** The form currently uses five `useState` calls (via one state object). Refactor to `useReducer` with named actions (`updateField`, `reset`, `loadInitial`). Justify in a comment why this is (or isn't) actually better here.
- **Done when:** Behavior is identical. The reducer is testable in isolation.

---

## Cross-stack (~1–2 hr each)

### 13. Add tags to tasks (many-to-many)
- **Where:** all of `backend/tasks/`, `frontend/src/`
- **What:** Add a `Tag` model (`name`, `color`) with M2M to `Task`. Expose nested tags in the serializer. In the UI, let users add/remove tags inline on each task.
- **Done when:** A task can have multiple tags; you can filter tasks by tag (`?tag=<id>`); tag CRUD works.

### 14. Drag-to-reorder within a category
- **Where:** new `order` field on `Task`, both backend and frontend
- **What:** Persist a user-defined order per category. Implement drag-and-drop reordering on the frontend (HTML5 drag events are fine — no library needed). Use a single endpoint to save the new order.
- **Done when:** Reorder survives page reload; reordering doesn't issue one request per item.

### 15. Recurring tasks
- **Where:** model + serializer + a small "complete & roll forward" view
- **What:** Add a `recurrence` field (`none` / `daily` / `weekly`). When a recurring task is completed, automatically create the next instance with the appropriate `due_date`.
- **Done when:** Completing a weekly recurring task creates a new task dated 7 days later, with the same metadata and `completed=false`.

---

## Stretch

### 16. Migrate the frontend to TypeScript
Convert `.jsx` → `.tsx`, add types for the API responses, set up `tsconfig.json` and `@types/react`. Aim for zero `any`. Document any pain points.

### 17. Add an audit log
New model `TaskEvent` (task, action, payload, created_at). On every create/update/delete, write an event. Expose `GET /api/tasks/{id}/history/`. Bonus: use a `post_save` / `post_delete` signal.

### 18. Containerize it
Write a `docker-compose.yml` with separate backend and frontend services. Backend serves the API; frontend serves the built React bundle from `nginx`. Don't use the dev servers in the final image.

---

## How to verify your work

Most tasks suggest a "Done when" — start there. Some general habits worth practicing:

- For backend changes: hit the endpoint with `curl`, then check it through the React UI.
- For query/performance changes: count queries with `django.db.connection.queries` (must enable `DEBUG=True`).
- For frontend changes: turn on throttling in DevTools and verify the UX still works.
- For refactors: there should be **no** behavior change — just better code. Be honest about that line.

If you get stuck on a task, write down what you tried and why it didn't work before asking for help. That alone is a mid-level skill.
