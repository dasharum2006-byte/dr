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
    catImage.src = 'images/CatDancing.gif';
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
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
});