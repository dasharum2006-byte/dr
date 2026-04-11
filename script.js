const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.querySelector('.wanthug');
const title = document.querySelector('h1');
const buttonsContainer = document.querySelector('.buttons');

// Устанавливаем заголовок при загрузке страницы
title.textContent = 'У тебя сегодня День Рождения?';
title.style.fontSize = '30px';
catImage.src = 'images/CatDancing.gif';

let yesHoverCount = 0; // Счетчик наведений на кнопку "Да"

// === Кнопка "Нет" — только клик, убегания нет ===
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    title.style.fontSize = '30px';
    catImage.src = 'images/Dog.gif';
});

// === Кнопка "Да" убегает при наведении ===
yesBtn.addEventListener('mouseover', () => {
    // Если уже было 10 наведений или больше, кнопка не двигается
    if (yesHoverCount >= 10) {
        return; // Выходим, позиция не меняется
    }

    // Увеличиваем счетчик наведений
    yesHoverCount++;
    
    console.log(`Наведение на "Да" №${yesHoverCount}`); // Для отладки

    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
    
    // Убираем трансформацию, которая может мешать позиционированию
    yesBtn.style.transform = 'none';
});

// === При клике на "Да" — показываем поздравление ===
yesBtn.addEventListener('click', () => {
    buttonsContainer.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';
    title.style.fontSize = '30px';
    title.textContent = 'Нажми кнопку';
    title.style.fontSize = '30px';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
    // Показываем кнопку "Далее"
    document.getElementById('next-stage').style.display = 'block';
});
// === Кнопка "Далее" — показываем колесо ===
document.getElementById('next-btn').addEventListener('click', () => {
    document.getElementById('next-stage').style.display = 'none';
    document.getElementById('wheel-container').style.display = 'block';
    title.textContent = 'Крути барабан! 🎡';
});

// === Логика колеса ===
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultEl = document.getElementById('result');

let lastResult = null;
let isSpinning = false;

// Функция выбора сектора с учётом вероятности повтора (1/3)
function getRandomSector() {
    const sectors = [1, 2, 3, 4];
    
    // Если есть последний результат и срабатывает шанс 1/3 — возвращаем его
    if (lastResult !== null && Math.random() < 1/3) {
        return lastResult;
    }
    
    // Иначе выбираем случайный, исключая последний (чтобы не было 100% повтора)
    const available = sectors.filter(s => s !== lastResult);
    const result = available[Math.floor(Math.random() * available.length)];
    return result;
}

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = '';
    resultEl.classList.remove('show');
    
    // Выбираем результат
    const sector = getRandomSector();
    lastResult = sector;
    
    // Рассчитываем угол: каждый сектор = 90°, добавляем случайный разброс внутри сектора
    const baseAngle = (sector - 1) * 90;
    const randomOffset = Math.floor(Math.random() * 70) + 10; // 10°–80° внутри сектора
    const totalRotation = 360 * 5 + baseAngle + randomOffset; // 5 полных оборотов + сектор
    
    // Вращаем колесо
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // Показываем результат после завершения анимации
    setTimeout(() => {
        resultEl.textContent = `Выпало: ${sector}! 🎉`;
        resultEl.classList.add('show');
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Опционально: можно добавить особое поздравление для определённого сектора
        if (sector === 1) {
            setTimeout(() => {
                title.textContent = 'С Днём Рождения! 🎂🎈';
                catImage.src = 'images/CatDancing.gif';
            }, 500);
        }
    }, 4000); // 4 секунды = длительность анимации в CSS
});