// Получаем элементы
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.getElementById('cat-image');
const title = document.getElementById('title');
const buttonsContainer = document.getElementById('buttons');
const nextStage = document.getElementById('next-stage');
const wheelContainer = document.getElementById('wheel-container');

let yesHoverCount = 0;

// ========== КНОПКА "НЕТ" ==========
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    catImage.src = 'images/Dog.gif';
    buttonsContainer.style.display = 'none';  // Скрываем кнопки Нет/Да
    nextStage.style.display = 'block';        // Показываем кнопку Далее
});

// ========== КНОПКА "ДА" (убегает) ==========
yesBtn.addEventListener('mouseover', () => {
    if (yesHoverCount >= 10) return;
    
    yesHoverCount++;
    
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
});

// ========== КЛИК НА "ДА" ==========
yesBtn.addEventListener('click', () => {
    buttonsContainer.style.display = 'none';  // Скрываем кнопки
    title.textContent = 'Да ладно, ничесе 😮';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
    nextStage.style.display = 'block';        // Показываем кнопку Далее
});

// ========== КНОПКА "ДАЛЕЕ" ==========
document.getElementById('next-btn').addEventListener('click', () => {
    nextStage.style.display = 'none';         // Скрываем кнопку Далее
    catImage.style.display = 'none';          // УБИРАЕМ КАРТИНКУ
    wheelContainer.style.display = 'block';   // Показываем КОЛЕСО
    title.textContent = 'Крути барабан! 🎡';
});

// ========== ЛОГИКА КОЛЕСА ==========
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
    
    const sectorAngle = 360 / 4;
    const targetAngle = (sector - 1) * sectorAngle;
    const spins = 5;
    const randomOffset = Math.floor(Math.random() * 60) + 15;
    
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