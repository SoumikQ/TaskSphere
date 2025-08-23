const token = localStorage.getItem('token');
if (!token) window.location.href = '/login';

const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };

const tbody = document.getElementById('tasks-body');
const statsDiv = document.getElementById('stats');
const searchInput = document.getElementById('search');
const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
});

async function loadStats() {
  const res = await fetch('/api/tasks/stats', { headers });
  const data = await res.json();
  if (!res.ok) { statsDiv.textContent = 'Failed to load stats'; return; }
  statsDiv.innerHTML = `<strong>Pending:</strong> ${data.pending} • <strong>Completed:</strong> ${data.completed}`;
}

async function loadTasks(search='') {
  const res = await fetch('/api/tasks?search=' + encodeURIComponent(search), { headers });
  const data = await res.json();
  if (!res.ok) { alert(data.message || 'Failed to load tasks'); return; }
  tbody.innerHTML = '';
  data.items.forEach(t => {
    const tr = document.createElement('tr');
    const due = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-';
    tr.innerHTML = `
      <td>${t.title}<div class="notice">${t.description || ''}</div></td>
      <td>${due}</td>
      <td>${t.priority}</td>
      <td><span class="badge ${t.status.toLowerCase()}">${t.status}</span></td>
      <td class="actions">
        <button class="success" data-edit="${t._id}">Edit</button>
        <button data-complete="${t._id}">Complete</button>
        <button class="danger" data-del="${t._id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

searchInput.addEventListener('input', (e) => loadTasks(e.target.value));

tbody.addEventListener('click', async (e) => {
  const id = e.target.dataset.del || e.target.dataset.edit || e.target.dataset.complete;
  if (!id) return;
  if (e.target.dataset.del) {
    if (!confirm('Delete this task?')) return;
    const res = await fetch('/api/tasks/' + id, { method: 'DELETE', headers });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Delete failed');
    await loadTasks(searchInput.value);
    await loadStats();
  } else if (e.target.dataset.edit) {
    // populate form
    const res = await fetch('/api/tasks/' + id, { headers });
    const t = await res.json();
    document.getElementById('taskId').value = t._id;
    document.getElementById('title').value = t.title;
    document.getElementById('description').value = t.description || '';
    document.getElementById('dueDate').value = t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : '';
    document.getElementById('priority').value = t.priority;
    document.getElementById('status').value = t.status;
    document.getElementById('title').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (e.target.dataset.complete) {
    const res = await fetch('/api/tasks/' + id + '/complete', { method: 'PATCH', headers });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Failed to mark complete');
    await loadTasks(searchInput.value);
    await loadStats();
  }
});

// Form submit create/update
const form = document.getElementById('task-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('taskId').value;
  const payload = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    dueDate: document.getElementById('dueDate').value || null,
    priority: document.getElementById('priority').value,
    status: document.getElementById('status').value,
  };
  if (!payload.title) return alert('Title is required');
  const url = id ? '/api/tasks/' + id : '/api/tasks';
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Save failed');
  form.reset();
  document.getElementById('taskId').value = '';
  await loadTasks(searchInput.value);
  await loadStats();
});

// init
loadTasks();
loadStats();