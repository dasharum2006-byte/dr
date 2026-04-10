const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.querySelector('.wanthug');
const title = document.querySelector('h1');
const buttonsContainer = document.querySelector('.buttons');

// Устанавливаем заголовок при загрузке страницы
title.textContent = 'У тебя сегодня День Рождения?';
title.style.fontSize = '30px';
catImage.src = 'images/CatDancing.gif';

let noClickCount = 0;

// Кнопка "Нет" убегает от курсора
noBtn.addEventListener('mouseover', () => {
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
});

// Исправлено: всё что должно происходить при клике на "Нет" - внутри обработчика
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    title.style.fontSize = '30px';
    catImage.src = 'images/CatDancing.gif';
});

// При нажатии на "Да"
yesBtn.addEventListener('click', () => {
    buttonsContainer.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';
    title.style.fontSize = '30px';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
});