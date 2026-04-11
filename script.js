const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.getElementById('cat-image');
const title = document.getElementById('title');
const buttonsWrapper = document.getElementById('buttons-wrapper');
const nextStage = document.getElementById('next-stage');
const wheelContainer = document.getElementById('wheel-container');
const congratsScreen = document.getElementById('congrats-screen');

let yesHoverCount = 0;

// 1. КНОПКА "НЕТ"
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    catImage.src = 'images/Dog.gif';
    buttonsWrapper.style.display = 'none';
    nextStage.style.display = 'block';
});

// 2. КНОПКА "ДА" (Убегает)
yesBtn.addEventListener('mouseover', () => {
    if (yesHoverCount >= 10) return; // После 10 раз перестает убегать
    yesHoverCount++;

    // Получаем размеры контейнера и кнопки
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();

    // Вычисляем максимальные координаты (чтобы кнопка не вылетела за белый квадрат)
    // Отнимаем 50px запаса, чтобы кнопка точно была видна
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;

    // Генерируем случайные координаты
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // Применяем стили
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
});

// 3. КЛИК НА "ДА" (Когда поймал)
yesBtn.addEventListener('click', () => {
    buttonsWrapper.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
    nextStage.style.display = 'block';
});

// 4. КНОПКА "ДАЛЕЕ"
document.getElementById('next-btn').addEventListener('click', () => {
    nextStage.style.display = 'none';
    catImage.style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан! 🎡';
});

// 5. КОЛЕСО
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultEl = document.getElementById('result');

let lastResult = null;
let isSpinning = false;
let currentRotation = 0;

function getRandomSector() {
    const sectors = [1, 2, 3, 4];
    if (lastResult !== null && Math.random() < 1/3) return lastResult;
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
                wheelContainer.style.display = 'none';
                resultEl.textContent = '';
                congratsScreen.style.display = 'block';
                title.textContent = 'С Днём Рождения!';
            }, 500);
        }
    }, 4000);
});

// 6. КНОПКА "ВЕРНУТЬСЯ"
document.getElementById('return-btn').addEventListener('click', () => {
    congratsScreen.style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан! 🎡';
});