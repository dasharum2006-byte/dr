// Элементы экранов
const screenQuestion = document.getElementById('screen-question');
const screenPersuade = document.getElementById('screen-persuade');
const screenForm = document.getElementById('screen-form');
const screenCongrats = document.getElementById('screen-congrats');

// Кнопки
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnBackToYes = document.getElementById('btn-back-to-yes');
const btnSubmitAge = document.getElementById('btn-submit-age');

// Поле ввода
const ageInput = document.getElementById('age-input');

// Счётчик попыток побега
let moves = 0;
const maxMoves = 5; // Кнопка убежит 5 раз, потом дастся

// Функция переключения экранов
function showScreen(targetScreen) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    targetScreen.classList.add('active');
}

// Функция перемещения кнопки ДА
function moveYesButton() {
    if (moves >= maxMoves) return;
    
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = btnYes.getBoundingClientRect();
    
    // Вычисляем доступную область
    const maxX = containerRect.width - buttonRect.width - 10;
    const maxY = containerRect.height - buttonRect.height - 10;
    
    // Случайная позиция
    const randomX = Math.floor(Math.random() * maxX) + 5;
    const randomY = Math.floor(Math.random() * maxY) + 5;
    const randomRotate = Math.floor(Math.random() * 20 - 10);
    
    btnYes.style.left = `${randomX}px`;
    btnYes.style.top = `${randomY}px`;
    btnYes.style.transform = `rotate(${randomRotate}deg)`;
    
    moves++;
    
    // Меняем текст кнопки
    const texts = ["Не поймаешь!", "Я тут!", "Попробуй ещё!", "Ха-ха!", "Ладно, жми!"];
    if (moves < maxMoves) {
        btnYes.textContent = texts[moves - 1];
    } else {
        btnYes.textContent = "ДА (наконец-то)";
    }
}

// Событие наведения на кнопку ДА (для ПК)
btnYes.addEventListener('mouseenter', moveYesButton);

// Событие касания (для телефонов)
btnYes.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveYesButton();
});

// Клик по кнопке ДА
btnYes.addEventListener('click', () => {
    if (moves < maxMoves) {
        moveYesButton();
    } else {
        // Переход к форме возраста
        showScreen(screenForm);
        ageInput.focus();
    }
});

// Клик по кнопке НЕТ
btnNo.addEventListener('click', () => {
    // Переход на экран уговоров
    showScreen(screenPersuade);
});

// Кнопка "ДА (ладно уж)" на экране уговоров
btnBackToYes.addEventListener('click', () => {
    // Возврат к вопросу
    moves = 0;
    btnYes.textContent = "ДА";
    btnYes.style.left = "50%";
    btnYes.style.top = "5px";
    btnYes.style.transform = "translateX(-50%)";
    showScreen(screenQuestion);
});

// Отправка возраста
btnSubmitAge.addEventListener('click', () => {
    const age = ageInput.value.trim();
    
    if (!age || age < 1 || age > 120) {
        alert("Пожалуйста, введи корректный возраст (1-120)");
        return;
    }
    
    // Показываем поздравление
    document.getElementById('congrats-text').innerHTML = `
        Тебе исполнилось <strong>${age}</strong> лет! 🎂<br><br>
        Пусть этот год будет полон счастья, любви и невероятных приключений!<br>
        Ты заслуживаешь всего самого лучшего! 💖✨
    `;
    
    showScreen(screenCongrats);
    startConfetti();
});

// Отправка по Enter в поле ввода
ageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnSubmitAge.click();
    }
});

// Функция конфетти
function startConfetti() {
    const duration = 2500;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}