AOS.init({ duration: 700, once: true });

const daysContainer = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
const eventTitle = document.getElementById('eventTitle');
const eventDesc = document.getElementById('eventDesc');
const eventDate = document.getElementById('eventDate');
const saveBtn = document.getElementById('saveEvent');
const deleteBtn = document.getElementById('deleteEvent');

let date = new Date();
let selectedDate = null;

function loadCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekDay = firstDay.getDay();
  const lastDate = lastDay.getDate();

  monthYear.textContent = `${firstDay.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${year}`;

  daysContainer.innerHTML = '';
  const prevLastDay = new Date(year, month, 0).getDate();

  // Días anteriores del mes pasado
  for (let i = firstWeekDay; i > 0; i--) {
    const day = document.createElement('div');
    day.classList.add('day', 'inactive');
    day.textContent = prevLastDay - i + 1;
    daysContainer.appendChild(day);
  }

  // Días del mes actual
  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement('div');
    day.classList.add('day');
    day.textContent = i;
    const fullDate = `${year}-${month + 1}-${i}`;
    const events = getEvents();
    if (events[fullDate]) {
      const dot = document.createElement('div');
      dot.classList.add('event-dot');
      day.appendChild(dot);
    }
    day.addEventListener('click', () => openModal(fullDate));
    daysContainer.appendChild(day);
  }

  // Días del siguiente mes
  const nextDays = 42 - daysContainer.childElementCount;
  for (let i = 1; i <= nextDays; i++) {
    const day = document.createElement('div');
    day.classList.add('day', 'inactive');
    day.textContent = i;
    daysContainer.appendChild(day);
  }
}

function openModal(fullDate) {
  selectedDate = fullDate;
  const events = getEvents();
  const event = events[fullDate];
  if (event) {
    eventTitle.value = event.title;
    eventDesc.value = event.desc;
    deleteBtn.classList.remove('d-none');
  } else {
    eventTitle.value = '';
    eventDesc.value = '';
    deleteBtn.classList.add('d-none');
  }
  eventDate.textContent = `Fecha: ${fullDate}`;
  eventModal.show();
}

function getEvents() {
  return JSON.parse(localStorage.getItem('calendarEvents') || '{}');
}

function saveEvents(events) {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
}

saveBtn.addEventListener('click', () => {
  const title = eventTitle.value.trim();
  const desc = eventDesc.value.trim();
  if (!title) return alert('Agrega un título para el evento');

  const events = getEvents();
  events[selectedDate] = { title, desc };
  saveEvents(events);
  eventModal.hide();
  loadCalendar();
});

deleteBtn.addEventListener('click', () => {
  const events = getEvents();
  delete events[selectedDate];
  saveEvents(events);
  eventModal.hide();
  loadCalendar();
});

prevMonthBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() - 1);
  loadCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() + 1);
  loadCalendar();
});

loadCalendar();
