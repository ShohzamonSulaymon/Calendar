let currentDate = new Date();
let selectedDate = null;
let notes = JSON.parse(localStorage.getItem('notes')) || {};

const monthYear = document.getElementById('month-year');
const daysGrid = document.getElementById('days-grid');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const prevYearBtn = document.getElementById('prev-year');
const nextYearBtn = document.getElementById('next-year');
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');

function renderCalendar() {
  daysGrid.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  for (let i = 0; i < startOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'empty');
    daysGrid.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;

    const isToday = day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
    if (isToday) dayElement.classList.add('today');

    dayElement.addEventListener('click', (event) => selectDay(day, event));
    daysGrid.appendChild(dayElement);
  }
}

function selectDay(day, event) {
  selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
  event.target.classList.add('selected');
  renderNotes();
}

function renderNotes() {
  notesList.innerHTML = '';
  if (selectedDate) {
    const dateKey = selectedDate.toISOString().split('T')[0];
    if (notes[dateKey]) {
      notes[dateKey].forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.onclick = () => deleteNote(dateKey, index);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
      });
    }
  }
}

addNoteBtn.onclick = () => {
  if (selectedDate && noteInput.value) {
    const dateKey = selectedDate.toISOString().split('T')[0];
    if (!notes[dateKey]) notes[dateKey] = [];
    notes[dateKey].push(noteInput.value);
    localStorage.setItem('notes', JSON.stringify(notes));
    noteInput.value = '';
    renderNotes();
  }
};

function deleteNote(dateKey, index) {
  notes[dateKey].splice(index, 1);
  if (notes[dateKey].length === 0) delete notes[dateKey];
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
}

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

prevYearBtn.onclick = () => {
  currentDate.setFullYear(currentDate.getFullYear() - 1);
  renderCalendar();
};

nextYearBtn.onclick = () => {
  currentDate.setFullYear(currentDate.getFullYear() + 1);
  renderCalendar();
};

renderCalendar();
