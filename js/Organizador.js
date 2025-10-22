AOS.init({duration:600,once:true});

const STORAGE_TASKS = 'organizerTasks_v1';
const STORAGE_PROJECTS = 'organizerProjects_v1';

const tasksListEl = document.getElementById('tasksList');
const totalTasksEl = document.getElementById('totalTasks');
const completedCountEl = document.getElementById('completedCount');
const pendingCountEl = document.getElementById('pendingCount');
const projectsListEl = document.getElementById('projectsList');
// tengo que eliminar la funcion btnNewTask 2 o 1 por que unsa se redirige a la otra y el boton no lo reconoce :D ya deberia de funcinar
const btnNewTask = document.getElementById('btnNewTask');
const viewCalendar = document.getElementById('viewCalendar');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const taskModalEl = document.getElementById('taskModal');
const taskModal = new bootstrap.Modal(taskModalEl);
const taskForm = document.getElementById('taskForm');
const taskModalTitle = document.getElementById('taskModalTitle');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');

const inputId = document.getElementById('taskId');
const inputTitle = document.getElementById('taskTitle');
const inputDesc = document.getElementById('taskDesc');
const inputDate = document.getElementById('taskDate');
const inputProject = document.getElementById('taskProject');
const inputPriority = document.getElementById('taskPriority');
const inputDone = document.getElementById('taskDone');

let tasks = [];
let projects = [];
let currentFilter = 'all';
let currentSort = null;

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8) }

function loadStorage(){
  tasks = JSON.parse(localStorage.getItem(STORAGE_TASKS) || 'null') || null;
  projects = JSON.parse(localStorage.getItem(STORAGE_PROJECTS) || 'null') || null;
  if(!projects || !tasks){
    seedData();
  }
}
function saveStorage(){
  localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
  localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projects));
}

function seedData(){
  projects = [
    { id:'p1', name:'Rediseño de sitio web' },
    { id:'p2', name:'Campaña de marketing' },
    { id:'p3', name:'App móvil' }
  ];
  tasks = [
    { id:uid(), title:'Completar informe mensual', desc:'Enviar reporte a la gerencia', date:'2024-01-20', project:'p1', priority:'high', done:false },
    { id:uid(), title:'Revisar propuesta de proyecto', desc:'Ajustes solicitud cliente', date:'2024-01-22', project:'p2', priority:'medium', done:false },
    { id:uid(), title:'Preparar presentación para cliente', desc:'Slides y notas', date:'2024-01-18', project:'p1', priority:'high', done:false },
    { id:uid(), title:'Ejercicio matutino', desc:'30 min cardio', date:'2024-01-15', project:'p3', priority:'medium', done:true },
    { id:uid(), title:'Llamar al dentista', desc:'Agendar cita', date:'2024-01-25', project:'p3', priority:'low', done:false }
  ];
  saveStorage();
}

function renderProjects(){
  projectsListEl.innerHTML = '';
  projects.forEach(p=>{
    const pTasks = tasks.filter(t=>t.project===p.id);
    const done = pTasks.filter(t=>t.done).length;
    const total = pTasks.length || 1;
    const percent = Math.round((done/total)*100);
    const div = document.createElement('div');
    div.className = 'project-card';
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>${p.name}</strong>
        <small class="text-muted">${percent}%</small>
      </div>
      <div class="progress-mini"><div style="width:${percent}%;background:${getProjectColor(p.id)}"></div></div>
      <div class="text-muted small mt-2">${done}/${pTasks.length} tareas completadas</div>
    `;
    projectsListEl.appendChild(div);
  });

  // populate project select
  inputProject.innerHTML = '';
  projects.forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    inputProject.appendChild(opt);
  });
}

function getProjectColor(id){
  const map = {'p1':'#2563eb','p2':'#7c3aed','p3':'#10b981'};
  return map[id] || '#2563eb';
}

function renderSummary(){
  totalTasksEl.textContent = tasks.length;
  completedCountEl.textContent = tasks.filter(t=>t.done).length;
  pendingCountEl.textContent = tasks.filter(t=>!t.done).length;
}

function renderTasks(){
  let filtered = tasks.slice();

  if(currentFilter==='pending') filtered = filtered.filter(t=>!t.done);
  if(currentFilter==='completed') filtered = filtered.filter(t=>t.done);

  if(currentSort==='date') filtered.sort((a,b)=> (a.date||'') > (b.date||'') ? 1 : -1 );
  if(currentSort==='priority') {
    const order = {high:0,medium:1,low:2};
    filtered.sort((a,b)=> order[a.priority] - order[b.priority] );
  }

  tasksListEl.innerHTML = '';
  if(filtered.length===0){
    tasksListEl.innerHTML = `<div class="text-center text-muted py-4">No hay tareas</div>`;
    return;
  }

  filtered.forEach(t=>{
    const card = document.createElement('div');
    card.className = 'task-item';
    const projectName = (projects.find(p=>p.id===t.project) || {}).name || 'Sin proyecto';
    const badge = t.priority==='high' ? 'badge-priority-high' : (t.priority==='medium' ? 'badge-priority-medium' : 'badge-priority-low');
    card.innerHTML = `
      <div class="task-row">
        <div>
          <h6 class="${t.done ? 'text-decoration-line-through text-muted' : ''} mb-1">${t.title}</h6>
          <div class="task-meta">
            <div><i class="ri-calendar-line me-1"></i> ${t.date || 'Sin fecha'}</div>
            <div><i class="ri-bookmark-line me-1"></i> ${projectName}</div>
            <div><span class="px-2 py-1 rounded ${badge}" style="font-size:.8rem">${t.priority}</span></div>
            ${t.desc ? `<div class="text-truncate" style="max-width:260px">${t.desc}</div>` : ''}
          </div>
        </div>
        <div class="task-actions d-flex flex-column align-items-end">
          <div>
            <button class="btnToggleComplete" title="Marcar completada">${t.done ? '<i class="ri-checkbox-circle-fill text-success"></i>' : '<i class="ri-checkbox-circle-line"></i>'}</button>
            <button class="btnEdit" title="Editar"><i class="ri-edit-line"></i></button>
            <button class="btnDelete" title="Eliminar"><i class="ri-delete-bin-line text-danger"></i></button>
          </div>
        </div>
      </div>
    `;
    // actions
    card.querySelector('.btnToggleComplete').addEventListener('click',()=>{
      toggleComplete(t.id);
    });
    card.querySelector('.btnEdit').addEventListener('click',()=>{
      openEditTask(t.id);
    });
    card.querySelector('.btnDelete').addEventListener('click',()=>{
      if(confirm('Eliminar tarea?')) { deleteTask(t.id); }
    });
    tasksListEl.appendChild(card);
  });
}

function toggleComplete(id){
  tasks = tasks.map(t=> t.id===id ? {...t, done: !t.done} : t );
  saveStorage(); renderTasks(); renderSummary(); renderProjects();
}

function deleteTask(id){
  tasks = tasks.filter(t=>t.id!==id);
  saveStorage(); renderTasks(); renderSummary(); renderProjects();
}

function openEditTask(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  inputId.value = t.id;
  inputTitle.value = t.title;
  inputDesc.value = t.desc || '';
  inputDate.value = t.date || '';
  inputProject.value = t.project || (projects[0] && projects[0].id);
  inputPriority.value = t.priority || 'medium';
  inputDone.checked = !!t.done;
  taskModalTitle.textContent = 'Editar Tarea';
  deleteTaskBtn.classList.remove('d-none');
  taskModal.show();
}

function openNewTask(){
  inputId.value = '';
  inputTitle.value = '';
  inputDesc.value = '';
  inputDate.value = '';
  inputPriority.value = 'medium';
  inputProject.value = projects[0] && projects[0].id;
  inputDone.checked = false;
  taskModalTitle.textContent = 'Nueva Tarea';
  deleteTaskBtn.classList.add('d-none');
  taskModal.show();
}

taskForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = inputId.value || uid();
  const payload = {
    id,
    title: inputTitle.value.trim(),
    desc: inputDesc.value.trim(),
    date: inputDate.value || '',
    project: inputProject.value || (projects[0] && projects[0].id),
    priority: inputPriority.value,
    done: inputDone.checked
  };
  const exists = tasks.find(t=>t.id===id);
  if(exists){
    tasks = tasks.map(t=> t.id===id ? payload : t );
  } else {
    tasks.unshift(payload);
  }
  saveStorage();
  taskModal.hide();
  renderTasks(); renderSummary(); renderProjects();
});

deleteTaskBtn.addEventListener('click', ()=>{
  const id = inputId.value;
  if(!id) return;
  if(confirm('Eliminar esta tarea?')) {
    deleteTask(id);
    taskModal.hide();
  }
});

btnNewTask.addEventListener('click', openNewTask);
btnNewTask.addEventListener('click', openNewTask);

viewCalendar.addEventListener('click', ()=> location.href = 'calendario.html');

exportBtn.addEventListener('click', ()=>{
  const data = JSON.stringify({projects,tasks},null,2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mi-tiempo-tareas.json'; a.click();
  URL.revokeObjectURL(url);
});

clearAllBtn.addEventListener('click', ()=>{
  if(confirm('Eliminar todas las tareas y proyectos de este navegador?')){
    localStorage.removeItem(STORAGE_TASKS);
    localStorage.removeItem(STORAGE_PROJECTS);
    seedData(); loadAndRender();
  }
});

document.querySelectorAll('.filter-btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    currentFilter = b.dataset.filter;
    renderTasks();
  });
});

document.querySelectorAll('.sort-item').forEach(s=>{
  s.addEventListener('click', e=>{
    e.preventDefault();
    currentSort = s.dataset.sort;
    renderTasks();
  });
});

function loadAndRender(){
  loadStorage();
  renderProjects();
  renderTasks();
  renderSummary();
}

loadAndRender();
