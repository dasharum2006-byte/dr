const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.querySelector('.wanthug');
const title = document.querySelector('h1');
const buttonsContainer = document.querySelector('.buttons');
const nextStage = document.getElementById('next-stage');
const wheelContainer = document.getElementById('wheel-container');

// Инициализация
title.textContent = 'У тебя сегодня День Рождения?';
catImage.src = 'images/CatDancing.gif';

let yesHoverCount = 0;

// === 🔴 Кнопка "Нет" — показываем ошибку и кнопку "Далее" ===
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    catImage.src = 'images/Dog.gif';
    buttonsContainer.style.display = 'none';
    nextStage.style.display = 'block'; // ✅ Показываем кнопку "Далее"
});

// === 🟢 Кнопка "Да" — убегает ===
yesBtn.addEventListener('mouseover', () => {
    if (yesHoverCount >= 10) return;
    
    yesHoverCount++;
    
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();
    
    // ✅ Ограничиваем движение в пределах контейнера
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
    yesBtn.style.transform = 'none';
});

// === 🟢 Клик на "Да" — поздравление ===
yesBtn.addEventListener('click', () => {
    buttonsContainer.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
    nextStage.style.display = 'block';
});

// === Кнопка "Далее" — показываем колесо ===
document.getElementById('next-btn').addEventListener('click', () => {
    nextStage.style.display = 'none';
    catImage.style.display = 'none'; // ✅ Убираем картинку
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан! 🎡';
});

// === Логика колеса ===
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultEl = document.getElementById('result');

let lastResult = null;
let isSpinning = false;
let currentRotation = 0;

function getRandomSector() {
    const sectors = [1, 2, 3, 4];
    if (lastResult !== null && Math.random() < 1/3) {
        return lastResult;
    }
    const available = sectors.filter(s => s !== lastResult);
    return available[Math.floor(Math.random() * available.length)];
}

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = '';
    
    const sector = getRandomSector();
    lastResult = sector;
    
    // ✅ Правильный расчёт угла для сектора
    // Сектор 1: 0-90°, 2: 90-180°, 3: 180-270°, 4: 270-360°
    // Стрелка сверху, поэтому нужно повернуть колесо так, чтобы нужный сектор был сверху
    const sectorAngle = 360 / 4; // 90 градусов на сектор
    const targetAngle = (sector - 1) * sectorAngle;
    const spins = 5; // количество полных оборотов
    const randomOffset = Math.floor(Math.random() * 60) + 15; // случайное смещение внутри сектора
    
    // Добавляем к текущему вращению, чтобы не сбрасывалось
    currentRotation += 360 * spins + (360 - targetAngle) + randomOffset;
    
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        resultEl.textContent = `Выпало: ${sector}! 🎉`;
        isSpinning = false;
        spinBtn.disabled = false;
        
        if (sector === 1) {
            setTimeout(() => {
                title.textContent = 'С Днём Рождения! 🎂';
                catImage.src = 'images/CatDancing.gif';
                catImage.style.display = 'block';
            }, 500);
        }
    }, 4000);
});