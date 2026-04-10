// script.js

const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.querySelector('.wanthug');
const title = document.querySelector('h1');
const buttonsContainer = document.querySelector('.buttons');
// Устанавливаем заголовок при загрузке страницы
title.textContent = 'С 14 февраля. Обнимашки?';
title.style.fontSize = '30px';

let noClickCount = 0;

// Кнопка "Нет" убегает от курсора
noBtn.addEventListener('mouseover', () => {
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Случайная позиция внутри контейнера
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
});
  // Меняем заголовок
    title.textContent = 'Как так то? Нажми  да';
    title.style.fontSize = '30px';
    noBtn.addEventListener('click', ()=> {
        catImage.src = 'images/Cat.gif';
    
});

// При нажатии на "Да"
yesBtn.addEventListener('click', () => {
    // Убираем кнопки
    buttonsContainer.style.display = 'none';
    
    // Меняем заголовок
    title.textContent = 'Я знала, что ты согласишься 😊';
    title.style.fontSize = '30px';
    
    // Меняем картинку на другую 
    catImage.src = 'images/hug.gif';

    
    // Добавляем эффект конфетти (опционально)
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
});