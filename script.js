const skills = [];
const skillsList = document.getElementById('skills-list');
const addSkillForm = document.getElementById('add-skill-form');

addSkillForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const skillName = e.target[0].value.trim();
  if (skillName) {
    skills.push({ name: skillName, experience: 0, level: 1 });
    renderSkills();
    e.target.reset();
  }
});

function renderSkills() {
  skillsList.innerHTML = ''; // Очищаем список навыков
  skills.forEach((skill, index) => {
    const skillItem = document.createElement('div');
    skillItem.classList.add('skill-item');

    // Создаем содержимое навыка
    skillItem.innerHTML = `
      <span class="skill-name">${skill.name} (Lvl: ${skill.level})</span>
      <div class="progress-controls">
        <button onclick="resetExperiance(${index})" class="experience-button experience-button-reset">↺</button>
        <button onclick="decreaseExperience(${index})" class="experience-button experience-button-down">–</button>
        <div class="progress-bar-column">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(skill.experience / (skill.level * 100)) * 100}%"></div>
          </div>
        </div>
        <button onclick="increaseExperience(${index})" class="experience-button experience-button-up">+</button>
      </div>
      <div class="delete-skill-column">
        <button onclick="deleteSkill(${index})" class="delete-skill-button">Удалить</button>
      </div>
    `;

    skillsList.appendChild(skillItem); // Добавляем навык в список
  });
}

// Функции для изменения опыта
function increaseExperience(index) {
  if (skills[index].level < 20) { // Ограничение уровня до 20
    skills[index].experience += 5; // Увеличиваем опыт на 5 единиц
    if (skills[index].experience >= skills[index].level * 100) {
      skills[index].level += 1; // Повышаем уровень, если достигнут максимум
      skills[index].experience = 0; // Сбрасываем опыт
    }
    renderSkills(); // Перерисовываем список
  }
}

function decreaseExperience(index) {
  if (skills[index].experience > 0) { // Уменьшаем опыт, если он больше 0
    skills[index].experience -= 5;
    if (skills[index].experience < 0) {
      skills[index].experience = 0; // Минимальное значение опыта — 0
    }
    renderSkills(); // Перерисовываем список
  }
}

function resetExperiance(index) {
  skills[index].experience = 0;
  renderSkills();
}

function deleteSkill(index) {
  skills.splice(index, 1);
  renderSkills();
}
