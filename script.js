const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const catImage = document.getElementById('cat-image');
const title = document.getElementById('title');
const buttonsWrapper = document.getElementById('buttons-wrapper');
const nextStage = document.getElementById('next-stage');
const wheelContainer = document.getElementById('wheel-container');
const congratsScreen = document.getElementById('congrats-screen');

let yesHoverCount = 0;

// === КНОПКА "НЕТ" ===
noBtn.addEventListener('click', () => {
    title.textContent = 'Ответ неправильный';
    catImage.src = 'images/Dog.gif';
    setTimeout(() => {
        title.textContent = 'У тебя сегодня День Рождения?';
        catImage.src = 'images/CatDancing.gif';
    }, 2000);
});

// === КНОПКА "ДА" (убегает при наведении) ===
yesBtn.addEventListener('mouseover', () => {
    if (yesHoverCount >= 8) return;
    yesHoverCount++;
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = 200;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
});

// === КЛИК НА "ДА" ===
yesBtn.addEventListener('click', () => {
    buttonsWrapper.style.display = 'none';
    title.textContent = 'Да ладно, ничесе 😮';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';
    nextStage.style.display = 'block';
});

// === КНОПКА "ДАЛЕЕ" ===
document.getElementById('next-btn').addEventListener('click', () => {
    nextStage.style.display = 'none';
    catImage.style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан 🎡';
});

// === КОЛЕСО ===
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultEl = document.getElementById('result');

let lastResult = null;
let isSpinning = false;
let currentRotation = 0;

function getRandomSector() {
    const sectors = [1, 2, 3, 4];
    
    // Если это первый запуск (lastResult === null), выбираем случайно
    if (lastResult === null) {
        return sectors[Math.floor(Math.random() * sectors.length)];
    }
    
    // Фильтруем все сектора, КРОМЕ последнего выпавшего
    const available = sectors.filter(s => s !== lastResult);
    
    // Выбираем случайный из оставшихся
    return available[Math.floor(Math.random() * available.length)];
}

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = '';

    const sector = getRandomSector();
    lastResult = sector;

    // Уменьшаем разброс, чтобы колесо не попадало на границу секторов
    const randomOffset = Math.floor(Math.random() * 30) - 15; // от -15 до +15
    const sectorAngle = 360 / 4;
    const targetAngle = (sector - 1) * sectorAngle;
    const spins = 5;

    currentRotation += 360 * spins + (360 - targetAngle) + randomOffset;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        resultEl.textContent = `Выпало: ${sector}! 🎉`;
        isSpinning = false;
        spinBtn.disabled = false;

        // Скрываем ВСЕ экраны перед показом нового
        wheelContainer.style.display = 'none';
        document.getElementById('congrats-screen').style.display = 'none';
        document.getElementById('cake-screen').style.display = 'none';
        document.getElementById('heart-screen').style.display = 'none';
        document.getElementById('final-congrats-screen').style.display = 'none';

        // Показываем нужный экран
        if (sector === 1) {
            document.getElementById('congrats-screen').style.display = 'block';
            title.textContent = 'С Днём Рождения 🎂';
        } 
        else if (sector === 2) {
            document.getElementById('cake-screen').style.display = 'block';
            title.textContent = 'Съешь весь торт 🍰';
            initCake();
        } 
        else if (sector === 3) {
            document.getElementById('heart-screen').style.display = 'flex';
            drawHeart();
        } 
        else if (sector === 4) {
            document.getElementById('final-congrats-screen').style.display = 'flex';
            if (typeof startFinalConfetti === 'function') startFinalConfetti();
        }
    }, 4000);
});

// === КНОПКА "ВЕРНУТЬСЯ" ===
document.getElementById('return-btn').addEventListener('click', () => {
    congratsScreen.style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан 🎡';
});

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ТОРТА (объявляем ОДИН РАЗ) =====
let cakeScene = null;
let cakeCamera = null;
let cakeRenderer = null;
let cakeControls = null;
let cakeGroup = null;
let slices = [];
let slicesLeft = 8;
let disappearingSlices = [];
let animationId = null;

function initCake() {
    // Сброс состояния
    slicesLeft = 8;
    slices = [];
    disappearingSlices = [];
    document.getElementById('counter').textContent = `Осталось кусочков: ${slicesLeft}`;

    // 1. Создаём сцену
    cakeScene = new THREE.Scene();
    cakeScene.background = new THREE.Color(0xfce4ec);

    // 2. Камера
    cakeCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    cakeCamera.position.set(0, 6, 9);
    cakeCamera.lookAt(0, 0.5, 0);

    // 3. Рендерер
    const cakeSceneEl = document.getElementById('cake-scene');
    if (!cakeSceneEl) return;
    
    // Очищаем старые элементы
    cakeSceneEl.innerHTML = '';
    
    // Возвращаем текст и подсказку
    const counterEl = document.createElement('h2');
    counterEl.id = 'counter';
    counterEl.textContent = `Осталось кусочков: 8`;
    cakeSceneEl.appendChild(counterEl);

    const hintEl = document.createElement('p');
    hintEl.className = 'hint';
    hintEl.textContent = '🖱️ Крути мышкой · 🖱️ Кликай по куску торта';
    cakeSceneEl.appendChild(hintEl);

    cakeRenderer = new THREE.WebGLRenderer({ antialias: true });
    cakeRenderer.setSize(window.innerWidth, window.innerHeight);
    cakeRenderer.shadowMap.enabled = true;
    cakeSceneEl.appendChild(cakeRenderer.domElement);

    // 4. Контролы
    cakeControls = new THREE.OrbitControls(cakeCamera, cakeRenderer.domElement);
    cakeControls.enableDamping = true;
    cakeControls.dampingFactor = 0.05;
    cakeControls.autoRotate = false;
    cakeControls.enablePan = false;

    // 5. Свет
    cakeScene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    cakeScene.add(dirLight);

    // 6. Стол и Тарелка
    const table = new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 4.5, 0.2, 32),
        new THREE.MeshStandardMaterial({ color: 0x8B6F47 })
    );
    table.position.y = -0.1;
    table.receiveShadow = true;
    cakeScene.add(table);

    const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(3.2, 3.2, 0.1, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    plate.position.y = 0.05;
    plate.receiveShadow = true;
    cakeScene.add(plate);

    // 7. ГРУППА ТОРТА
    cakeGroup = new THREE.Group();
    cakeScene.add(cakeGroup);

    const sliceCount = 8;
    const sliceAngle = (Math.PI * 2) / sliceCount;
    const cakeColor = 0xFFA500;
    const creamColor = 0xFFB6C1;

    // === СОЗДАЁМ 8 КУСКОВ ===
    for (let i = 0; i < sliceCount; i++) {
        const sliceGroup = new THREE.Group();
        sliceGroup.userData = { isSlice: true, id: i };
        sliceGroup.rotation.y = -i * sliceAngle;

        // БИСКВИТ
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, 1.8, 0, sliceAngle, false);
        shape.lineTo(0, 0);

        const extrudeSettings = { depth: 0.8, bevelEnabled: false };
        const spongeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        spongeGeo.rotateX(-Math.PI / 2);
        
        const spongeMat = new THREE.MeshStandardMaterial({ color: cakeColor, roughness: 0.7 });
        const sponge = new THREE.Mesh(spongeGeo, spongeMat);
        sponge.position.y = 0.5;
        sponge.castShadow = true;
        sponge.receiveShadow = true;
        sliceGroup.add(sponge);

        // КРЕМ
        const creamShape = new THREE.Shape();
        creamShape.moveTo(0, 0);
        creamShape.absarc(0, 0, 1.75, 0, sliceAngle, false);
        creamShape.lineTo(0, 0);

        const creamGeo = new THREE.ExtrudeGeometry(creamShape, { depth: 0.15, bevelEnabled: false });
        creamGeo.rotateX(-Math.PI / 2);
        
        const creamMat = new THREE.MeshStandardMaterial({ color: creamColor });
        const cream = new THREE.Mesh(creamGeo, creamMat);
        cream.position.y = 1.35;
        cream.castShadow = true;
        sliceGroup.add(cream);

        // СВЕЧКА
        const candleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const candleMat = new THREE.MeshStandardMaterial({ color: 0xFF69B4 });
        const candle = new THREE.Mesh(candleGeo, candleMat);
        
        const midAngle = sliceAngle / 2;
        const dist = 1.0;
        candle.position.set(
            Math.sin(midAngle) * dist,
            1.65,
            Math.cos(midAngle) * dist
        );
        candle.castShadow = true;
        sliceGroup.add(candle);

        // ОГОНЁК
        const flameGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const flameMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFFA500, emissiveIntensity: 0.8 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.copy(candle.position);
        flame.position.y += 0.25;
        flame.userData.isFlame = true;
        sliceGroup.add(flame);

        slices.push(sliceGroup);
        cakeGroup.add(sliceGroup);
    }

    // === ОБРАБОТКА КЛИКОВ ===
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    cakeRenderer.domElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, cakeCamera);

        const allMeshes = [];
        slices.forEach(s => {
            s.traverse(child => { if (child.isMesh) allMeshes.push(child); });
        });

        const intersects = raycaster.intersectObjects(allMeshes);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            while (target.parent && !target.userData.isSlice) {
                target = target.parent;
            }
            if (target.userData.isSlice && !target.userData.removing) {
                removeSlice(target);
            }
        }
    });

    // === УДАЛЕНИЕ КУСКА ===
    function removeSlice(slice) {
        slice.userData.removing = true;
        slicesLeft--;
        const counter = document.getElementById('counter');
        if (counter) counter.textContent = `Осталось кусочков: ${slicesLeft}`;
        disappearingSlices.push({ mesh: slice, scale: 1.0 });
    }

    // === АНИМАЦИЯ ===
    function animate() {
        animationId = requestAnimationFrame(animate);
        cakeControls.update();

        const time = Date.now() * 0.005;
        slices.forEach(slice => {
            const flame = slice.children.find(c => c.userData.isFlame);
            if (flame && !slice.userData.removing) {
                flame.scale.y = 1 + Math.sin(time * 3) * 0.2;
                flame.scale.x = 1 + Math.cos(time * 2) * 0.1;
            }
        });

        for (let i = disappearingSlices.length - 1; i >= 0; i--) {
            const item = disappearingSlices[i];
            item.scale -= 0.03;
            item.mesh.scale.setScalar(Math.max(0, item.scale));
            
            if (item.scale <= 0) {
                cakeGroup.remove(item.mesh);
                disappearingSlices.splice(i, 1);
                
                if (slicesLeft <= 0) {
                    setTimeout(() => {
                        document.getElementById('win-screen').classList.remove('hidden');
                    }, 500);
                }
            }
        }

        cakeRenderer.render(cakeScene, cakeCamera);
    }

    animate();
}

// === КНОПКА "ВЕРНУТЬСЯ К КОЛЕСУ" ===
const backToWheelBtn = document.getElementById('back-to-wheel-btn');
if (backToWheelBtn) {
    backToWheelBtn.addEventListener('click', () => {
        document.getElementById('cake-screen').style.display = 'none';
        document.getElementById('win-screen').classList.add('hidden');
        wheelContainer.style.display = 'block';
        title.textContent = 'Крути барабан 🎡';
        
        // Очищаем сцену торта
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        if (cakeRenderer) {
            cakeRenderer.dispose();
            const canvas = document.querySelector('#cake-scene canvas');
            if (canvas) canvas.remove();
        }
        // Сбрасываем переменные
        cakeScene = null;
        cakeCamera = null;
        cakeRenderer = null;
        cakeControls = null;
        cakeGroup = null;
        slices = [];
        slicesLeft = 8;
        disappearingSlices = [];
    });
}
// ===== ФУНКЦИЯ РИСОВАНИЯ СЕРДЦА =====
function drawHeart() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    const title = document.getElementById('heart-title');
    
    // Сбрасываем размер и очищаем (чтобы не рисовалось поверх старого)
    canvas.width = 400;
    canvas.height = 400;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Настройки линии
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ff0040';
    ctx.shadowColor = '#ff0040';
    ctx.shadowBlur = 20;
    
    // Генерируем точки сердца
    const points = [];
    const totalPoints = 300;
    
    for (let i = 0; i <= totalPoints; i++) {
        const t = (i / totalPoints) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        // Масштабируем и центрируем под canvas 400x400
        points.push({
            x: x * 10 + 200,
            y: y * 10 + 180
        });
    }
    
    let current = 0;
    
    function animate() {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i <= current; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        // "Кисточка" в конце линии
        if (current < totalPoints) {
            ctx.beginPath();
            ctx.arc(points[current].x, points[current].y, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#ff8fa3';
            ctx.fill();
        }
        
        current++;
        
        if (current <= totalPoints) {
            requestAnimationFrame(animate);
        } else {
            // Когда дорисовало
            title.textContent = "С Днём Рождения! 💖";
        }
    }
    
    animate();
}

// ===== КНОПКА "ВЕРНУТЬСЯ" ОТ СЕРДЦА =====
const backToWheelBtnHeart = document.getElementById('back-to-wheel-from-heart');
if (backToWheelBtnHeart) {
    backToWheelBtnHeart.addEventListener('click', () => {
        // Скрываем сердце
        document.getElementById('heart-screen').style.display = 'none';
        
        // Показываем колесо
        wheelContainer.style.display = 'block';
        title.textContent = 'Крути барабан  🎡';
    });
}
// ===== КОНФЕТТИ ДЛЯ СЕКТОРА 4 =====
function startFinalConfetti() {
    // Проверяем, подключена ли библиотека confetti
    if (typeof confetti === 'undefined') {
        console.log('Confetti library not loaded');
        return;
    }
    
    const duration = 5000; // 5 секунд
    const end = Date.now() + duration;
    
    // Запускаем несколько источников конфетти
    (function frame() {
        // Левая сторона
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#ff416c', '#ff4b2b', '#ff6b8a', '#ff8fa3', '#d81b60']
        });
        
        // Правая сторона
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#ff416c', '#ff4b2b', '#ff6b8a', '#ff8fa3', '#d81b60']
        });
        
        // Середина (вверх)
        confetti({
            particleCount: 3,
            angle: 90,
            spread: 30,
            origin: { x: 0.5, y: 0.8 },
            colors: ['#ffd700', '#ffa500', '#ff69b4', '#ff1493']
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
    
    // Дополнительный залп через 2 секунды
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff416c', '#ff4b2b', '#ffd700', '#ff69b4']
        });
    }, 2000);
}

// ===== КНОПКА "ВЕРНУТЬСЯ" ОТ ФИНАЛЬНОГО ПОЗДРАВЛЕНИЯ =====
const backToWheelFromFinal = document.getElementById('back-to-wheel-from-final');
if (backToWheelFromFinal) {
    backToWheelFromFinal.addEventListener('click', () => {
        document.getElementById('final-congrats-screen').style.display = 'none';
        wheelContainer.style.display = 'block';
        title.textContent = 'Крути барабан  🎡';
    });
}
// === КНОПКА ВОЗВРАТА (Экран 1) ===
document.getElementById('return-btn')?.addEventListener('click', () => {
    document.getElementById('congrats-screen').style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан 🎡';
});

// === КНОПКА ВОЗВРАТА (Экран 4) ===
document.getElementById('back-to-wheel-from-final')?.addEventListener('click', () => {
    document.getElementById('final-congrats-screen').style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан 🎡';
});