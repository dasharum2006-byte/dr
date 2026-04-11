const yesBtn = document.getElementById('yes-btn');  // Кнопка "Да" — убегает
const noBtn = document.getElementById('no-btn');    // Кнопка "Нет" — стоит
const catImage = document.querySelector('.wanthug');
const title = document.querySelector('h1');
const buttonsContainer = document.querySelector('.buttons');

// Инициализация
title.textContent = 'У тебя сегодня День Рождения?';
title.style.fontSize = '30px';
catImage.src = 'images/CatDancing.gif';

let yesHoverCount = 0;

// === 🔴 Кнопка "Нет" — клик, без убегания ===
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';  // ✅ Как вы просили
    title.style.fontSize = '30px';
    catImage.src = 'images/Dog.gif';
    buttonsContainer.style.display = 'none';
});

// === 🟣 Кнопка "Да" — убегает при наведении ===
yesBtn.addEventListener('mouseover', () => {
    if (yesHoverCount >= 10) return;
    
    yesHoverCount++;
    console.log(`Наведение на "Да" №${yesHoverCount}`);

    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
    yesBtn.style.transform = 'none';
});

// === 🟣 Клик на "Да" — поздравление ===
yesBtn.addEventListener('click', () => {
    buttonsContainer.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';  // ✅ Как вы просили
    title.style.fontSize = '30px';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
    
    // Показываем кнопку "Далее"
    document.getElementById('next-stage').classList.remove('hidden');
});

// === Кнопка "Далее" — показываем колесо ===
document.getElementById('next-btn').addEventListener('click', () => {
    document.getElementById('next-stage').classList.add('hidden');
    document.getElementById('wheel-container').classList.remove('hidden');
    title.textContent = 'Крути барабан';
});

// === Логика колеса ===
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultEl = document.getElementById('result');

let lastResult = null;
let isSpinning = false;

function getRandomSector() {
    const sectors = [1, 2, 3, 4];
    if (lastResult !== null && Math.random() < 1/3) {
        return lastResult; // 1/3 шанс повторения
    }
    const available = sectors.filter(s => s !== lastResult);
    return available[Math.floor(Math.random() * available.length)];
}

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = '';
    resultEl.classList.remove('show');
    
    const sector = getRandomSector();
    lastResult = sector;
    
    const baseAngle = (sector - 1) * 90;
    const randomOffset = Math.floor(Math.random() * 70) + 10;
    const totalRotation = 360 * 5 + baseAngle + randomOffset;
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(() => {
        resultEl.textContent = `Выпало: ${sector}! `;
        resultEl.classList.add('show');
        isSpinning = false;
        spinBtn.disabled = false;
        
        if (sector === 1) {
            setTimeout(() => {
                title.textContent = 'С Днём Рождения! 🎂🎈';
                catImage.src = 'images/CatDancing.gif';
            }, 500);
        }
    }, 4000);
});