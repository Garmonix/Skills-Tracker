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
      <span class="skill-name">${skill.name} (уровень: ${skill.level})</span>
      <div class="progress-bar-column">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(skill.experience / (skill.level * 100)) * 100}%"></div>
      </div>
      </div>
      <div class="delete-skill-column">
        <button onclick="deleteSkill(${index})" class="delete-skill-button">удалить</button>
      </div>
      
    `;

    skillsList.appendChild(skillItem); // Добавляем навык в список
  });
}

function deleteSkill(index) {
  skills.splice(index, 1);
  renderSkills();
}

let selectedSkillIndex = null;
let timerInterval = null;

document.getElementById('start-timer').addEventListener('click', () => {
  if (selectedSkillIndex !== null) {
    timerInterval = setInterval(() => {
      skills[selectedSkillIndex].experience += 1;
      if (skills[selectedSkillIndex].experience >= 100 * skills[selectedSkillIndex].level) {
        skills[selectedSkillIndex].level += 1;
      }
      renderSkills();
    }, 1000);
  }
});

document.getElementById('stop-timer').addEventListener('click', () => {
  clearInterval(timerInterval);
});

window.addEventListener('load', () => {
    const savedSkills = JSON.parse(localStorage.getItem('skills'));
    if (savedSkills) {
      skills.push(...savedSkills);
      renderSkills();
    }
  });
  
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('skills', JSON.stringify(skills));
  });