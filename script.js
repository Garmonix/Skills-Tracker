let skills = [];
const skillsList = document.getElementById('skills-list');
const addSkillForm = document.getElementById('add-skill-form');
const timeDisplay = document.getElementById('time-display'); // Элемент для времени
const startButton = document.getElementById('start-timer');
const resetButton = document.getElementById('reset-timer');
let selectedSkillIndex = null;

// Создаем кнопку "Стоп"
const stopButton = document.createElement('button');
stopButton.id = 'stop-timer';
stopButton.className = 'stop-timer';
const buttonText = document.createElement('span');
buttonText.className = 'timer-button-text';
buttonText.textContent = 'stop';
stopButton.appendChild(buttonText);

let seconds = 0;
let intervalId = null;
let totalTimeData = 0;

// [ИЗМЕНЕНИЯ]: Исправлена функция сохранения общего времени
function saveTotalTimeToLocalStorage() {
  localStorage.setItem('totalTimeData', totalTimeData);
}

// [ИЗМЕНЕНИЯ]: Исправлена функция обновления общего времени
function updateTotalTime(secondsToAdd) {
  totalTimeData += secondsToAdd; // Увеличиваем общее время на переданное значение
  const totalHours = (totalTimeData / 3600).toFixed(2); // Вычисляем часы
  document.getElementById('total-time-display').textContent = 
    `Total time: ${totalHours} ч.`; // Отображаем часы без лишних нулей
  saveTotalTimeToLocalStorage(); // Сохраняем изменения
}

// [ИЗМЕНЕНИЯ]: Добавлена функция загрузки общего времени
function loadTotalTimeFromLocalStorage() {
  const savedTotalTime = localStorage.getItem('totalTimeData');
  if (savedTotalTime !== null) {
    totalTimeData = parseFloat(savedTotalTime); // Преобразуем сохраненное значение в число
    updateTotalTime(0); // Обновляем отображение общего времени при загрузке
  }
}

function updateTimer() {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  // Увеличиваем опыт выбранного навыка
  if (selectedSkillIndex !== null && skills[selectedSkillIndex]) {
    skills[selectedSkillIndex].experience += 1; // Увеличиваем опыт на 1 за секунду
    if (skills[selectedSkillIndex].experience >= skills[selectedSkillIndex].level * 100) {
      skills[selectedSkillIndex].level += 1; // Повышаем уровень, если достигнут максимум
      skills[selectedSkillIndex].experience = 0; // Сбрасываем опыт
    }
    saveSkillsToLocalStorage(); // Сохраняем изменения в localStorage
    renderSkills(); // Перерисовываем список
  }

  // [ИЗМЕНЕНИЯ]: Общее время увеличивается всегда, а не только при наличии выбранного навыка
  updateTotalTime(1);
}

startButton.addEventListener('click', () => {
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000);
  }
  startButton.replaceWith(stopButton);
});

stopButton.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  stopButton.replaceWith(startButton);
});

resetButton.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  seconds = 0;
  totalTimeData = 0; // [ИЗМЕНЕНИЯ]: Сбрасываем общее время
  timeDisplay.textContent = '00:00';
  document.getElementById('total-time-display').textContent = 'Total time: 0.00 ч.'; // [ИЗМЕНЕНИЯ]: Сбрасываем отображение общего времени
  selectedSkillIndex = null;
  renderSkills();
});

function loadSkillsFromLocalStorage() {
  const savedSkills = localStorage.getItem('skills'); // Получаем данные из localStorage
  if (savedSkills) {
    skills.push(...JSON.parse(savedSkills)); // Добавляем сохраненные навыки в массив
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSkillsFromLocalStorage(); // Загружаем навыки из localStorage
  loadTotalTimeFromLocalStorage(); // [ИЗМЕНЕНИЯ]: Загружаем общее время
  renderSkills(); // Перерисовываем список навыков
});

addSkillForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const skillName = e.target[0].value.trim();
  if (skillName) {
    skills.push({ name: skillName, experience: 0, level: 1 });
    renderSkills();
    saveSkillsToLocalStorage(); // Сохраняем навыки после добавления
    e.target.reset();
  }
});

function renderSkills() {
  skillsList.innerHTML = ''; // Очищаем список навыков
  skills.forEach((skill, index) => {
    const skillItem = document.createElement('div');
    skillItem.classList.add('skill-item');

    // Добавляем класс 'selected-skill' для выбранного навыка
    if (index === selectedSkillIndex) {
      skillItem.classList.add('selected-skill');
    }

    skillItem.dataset.index = index; // Сохраняем индекс навыка в data-атрибуте
    skillItem.innerHTML = `
      <div class='skill-name-section'>
        <span class="skill-name">${skill.name} (Lvl: ${skill.level})</span>
        <button onclick="resetLevel(${index})" class="experience-button experience-button-reset-lvl">↺</button>
      </div>
      <div class="progress-controls">
        <button onclick="decreaseExperience(${index})" class="experience-button experience-button-down">-</button>
        <div class="progress-bar-column">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(skill.experience / (skill.level * 100)) * 100}%"></div>
          </div>
          <div class="experiense">
            <p class="experiense-text">exp: ${skill.experience}/${(skill.level * 100)}</p>
            <button onclick="resetExperience(${index})" class="experience-button experience-button-reset">↺</button>
          </div>
        </div>
        <button onclick="increaseExperience(${index})" class="experience-button experience-button-up">+</button>
      </div>
      <div class="delete-skill-column">
        <button onclick="deleteSkill(${index})" class="delete-skill-button">delete</button>
      </div>
    `;
    skillsList.appendChild(skillItem); // Добавляем навык в список

    // Добавляем обработчик для выбора навыка
    skillItem.addEventListener('click', (e) => {
      if (e.target.closest('.skill-item')) {
        selectSkill(index);
      }
    });
    skillItem.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем распространение события на родителя
      });
    });
  });
}

// Функция выбора навыка
function selectSkill(index) {
  if (selectedSkillIndex !== index) {
    selectedSkillIndex = index; // Обновляем индекс выбранного навыка
    renderSkills(); // Перерисовываем список, чтобы обновить класс 'selected-skill'
  } else {
    selectedSkillIndex = null; // Если кликнули на уже выбранный навык, снимаем выделение
    renderSkills();
  }
}

// Функции для изменения опыта
function increaseExperience(index) {
  if (skills[index].level < 20) { // Ограничение уровня до 20
    skills[index].experience += 10; // Увеличиваем опыт на 10 единиц
    if (skills[index].experience >= skills[index].level * 100) {
      skills[index].level += 1; // Повышаем уровень, если достигнут максимум
      skills[index].experience = 0; // Сбрасываем опыт
    }
    renderSkills(); // Перерисовываем список
    saveSkillsToLocalStorage(); 
  }
}

function decreaseExperience(index) {
  if (skills[index].experience > 0) { // Уменьшаем опыт, если он больше 0
    skills[index].experience -= 10;
    if (skills[index].experience < 0) {
      skills[index].experience = 0; // Минимальное значение опыта — 0
    }
    renderSkills(); // Перерисовываем список
    saveSkillsToLocalStorage();
  }
}

function resetExperience(index) {
  skills[index].experience = 0;
  renderSkills();
  saveSkillsToLocalStorage();
}

function resetLevel(index) {
  skills[index].level = 1;
  skills[index].experience = 0;
  saveSkillsToLocalStorage();
  renderSkills();
}

function deleteSkill(index) {
  skills.splice(index, 1);
  if (selectedSkillIndex === index || selectedSkillIndex > index) {
    // Корректируем индекс выбранного навыка при удалении
    if (selectedSkillIndex === index) {
      selectedSkillIndex = null; // Если удалили выбранный навык, сбрасываем индекс
    } else if (selectedSkillIndex > index) {
      selectedSkillIndex--; // Корректируем индекс, если удалили навык выше выбранного
    }
  }
  renderSkills();
  saveSkillsToLocalStorage();
}

function saveSkillsToLocalStorage() {
  localStorage.setItem('skills', JSON.stringify(skills)); // Сохраняем массив в формате JSON
}