const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.querySelector('.wanthug');
const title = document.querySelector('h1');
const buttonsContainer = document.querySelector('.buttons');

// Устанавливаем заголовок при загрузке страницы
title.textContent = 'У тебя сегодня День Рождения?';
title.style.fontSize = '30px';
catImage.src = 'images/CatDancing.gif';

let yesClickAttempts = 0; // Счетчик кликов по "Да" (попыток догнать)

// === ИЗМЕНЕНИЕ 1: Убираем обработчик убегания у кнопки "Нет" ===
// Оставляем только реакцию на клик по "Нет"
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    title.style.fontSize = '30px';
    catImage.src = 'images/CatDancing.gif';
});

// === ИЗМЕНЕНИЕ 2: Теперь убегает кнопка "Да" ===
yesBtn.addEventListener('mouseover', () => {
    // Если попыток уже 10 или больше, кнопка больше не двигается
    if (yesClickAttempts >= 10) {
        return; // Просто выходим из функции, позиция не меняется
    }

    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
});

// === ИЗМЕНЕНИЕ 3: Увеличиваем счетчик при клике на "Да" ===
yesBtn.addEventListener('click', (event) => {
    // Увеличиваем счетчик попыток
    yesClickAttempts++;

    // Если попыток меньше 10, значит он еще убегает и нажатие было случайным/ловким.
    // Но мы не хотим, чтобы срабатывал основной сценарий (смена фона и картинки) раньше времени.
    // Поэтому блокируем выполнение поздравления, пока не наберется 10 кликов.
    if (yesClickAttempts < 10) {
        title.textContent = `Почти поймал! (${yesClickAttempts}/10)`;
        title.style.fontSize = '30px';
        catImage.src = 'images/CatDancing.gif';
        return; // Прерываем выполнение, не даем показать финальную сцену
    }

    // Если мы здесь, значит попыток >= 10. Показываем финальное поздравление.
    buttonsContainer.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';
    title.style.fontSize = '30px';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
});