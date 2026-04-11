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
    // Меняем картинку и текст ( НЕ скрываем кнопки )
    title.textContent = 'Ответ неправильный';
    catImage.src = 'images/Rabbit.gif';

    // Через 2 секунды возвращаем всё обратно
    setTimeout(() => {
        title.textContent = 'У тебя сегодня День Рождения?';
        catImage.src = 'images/CatDancing.gif';
    }, 2000);
});


// === КНОПКА "ДА" (убегает при наведении) ===
yesBtn.addEventListener('mouseover', () => {
    // Останавливаем после 8 наведений
    if (yesHoverCount >= 8) return;
    yesHoverCount++;

    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = yesBtn.getBoundingClientRect();

    // Ограничиваем движение в пределах контейнера
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = 200;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    yesBtn.style.position = 'absolute';
    yesBtn.style.left = randomX + 'px';
    yesBtn.style.top = randomY + 'px';
});


// === КЛИК НА "ДА" (если поймал!) ===
yesBtn.addEventListener('click', () => {
    // Скрываем кнопки
    buttonsWrapper.style.display = 'none';

    // Показываем поздравление
    title.textContent = 'Да ладно, ничесе 😮';
    catImage.src = 'images/Rabbit.gif';
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)';

    // Показываем кнопку ДАЛЕЕ
    nextStage.style.display = 'block';
});


// === КНОПКА "ДАЛЕЕ" ===
document.getElementById('next-btn').addEventListener('click', () => {
    // Скрываем кнопку ДАЛЕЕ
    nextStage.style.display = 'none';

    // Скрываем картинку
    catImage.style.display = 'none';

    // Показываем КОЛЕСО
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан! 🎡';
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
        if (sector === 2) {
            setTimeout(() => {
                wheelContainer.style.display = 'none';
                resultEl.textContent = '';
               // ===== НАСТРОЙКА =====
const SLICES_COUNT = 8;
let slicesLeft = SLICES_COUNT;

// ===== СЦЕНА, КАМЕРА, РЕНДЕРЕР =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfce4ec);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('cake-scene').appendChild(renderer.domElement);

// ===== УПРАВЛЕНИЕ (крутить мышкой) =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI / 2.1; // Не заходить ниже стола
controls.minDistance = 4;
controls.maxDistance = 15;

// ===== ОСВЕЩЕНИЕ =====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 8, 5);
dirLight.castShadow = true;
scene.add(dirLight);

const backLight = new THREE.DirectionalLight(0xffb6c1, 0.3);
backLight.position.set(-3, 3, -5);
scene.add(backLight);

// ===== СТОЛ =====
const tableGeo = new THREE.CylinderGeometry(4, 4, 0.2, 32);
const tableMat = new THREE.MeshStandardMaterial({ color: 0x8B6F47 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -0.1;
table.receiveShadow = true;
scene.add(table);

// ===== ТАРРЕЛКА =====
const plateGeo = new THREE.CylinderGeometry(3, 3, 0.08, 32);
const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
const plate = new THREE.Mesh(plateGeo, plateMat);
plate.position.y = 0.04;
plate.receiveShadow = true;
scene.add(plate);

// ===== СОЗДАНИЕ ТОРТА =====
const sliceAngle = (Math.PI * 2) / SLICES_COUNT;
const slices = []; // Массив для хранения кусков

const cakeColor = 0xF4A460;      // Бисквит
const creamColor = 0xFFB6C1;     // Кремовый
const cherryColor = 0xDC143C;    // Вишня
const creamWhite = 0xFFF5EE;     // Белый крем

// Группа для всего торта
const cakeGroup = new THREE.Group();
scene.add(cakeGroup);

for (let i = 0; i < SLICES_COUNT; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;

    const sliceGroup = new THREE.Group();
    sliceGroup.userData = { sliceIndex: i, isSlice: true };

    // --- Бисквит (основа куска) ---
    const spongeGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.8, 32, 1, true, startAngle, sliceAngle);
    const spongeMat = new THREE.MeshStandardMaterial({
        color: cakeColor,
        side: THREE.DoubleSide,
        roughness: 0.8
    });
    const sponge = new THREE.Mesh(spongeGeo, spongeMat);
    sponge.position.y = 0.5;
    sponge.castShadow = true;
    sliceGroup.add(sponge);

    // --- Крышка торта (верхняя часть бисквита) ---
    const topGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 32, 1, true, startAngle, sliceAngle);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xD2691E, side: THREE.DoubleSide });
    const topCover = new THREE.Mesh(topGeo, topMat);
    topCover.position.y = 0.9;
    sliceGroup.add(topCover);

    // --- Боковые стенки (чтобы не было дырок) ---
    // Внутренняя стенка
    const innerWallGeo = new THREE.PlaneGeometry(0.8, 1.8);
    const innerWallMat = new THREE.MeshStandardMaterial({ color: cakeColor, side: THREE.DoubleSide });
    const innerWall = new THREE.Mesh(innerWallGeo, innerWallMat);
    innerWall.position.set(
        Math.sin(midAngle) * 0.05,
        0.5,
        Math.cos(midAngle) * 0.05
    );
    innerWall.rotation.y = midAngle;
    sliceGroup.add(innerWall);

    // --- Крем сверху ---
    const creamGeo = new THREE.CylinderGeometry(1.75, 1.75, 0.15, 32, 1, true, startAngle + 0.02, sliceAngle - 0.04);
    const creamMat = new THREE.MeshStandardMaterial({ color: creamColor, roughness: 0.4 });
    const cream = new THREE.Mesh(creamGeo, creamMat);
    cream.position.y = 0.95;
    cream.castShadow = true;
    sliceGroup.add(cream);

    // --- Бордюр из крема (маленькие шарики по краю) ---
    const borderCount = 5;
    for (let b = 0; b < borderCount; b++) {
        const bAngle = startAngle + (sliceAngle / (borderCount + 1)) * (b + 1);
        const borderGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const borderMat = new THREE.MeshStandardMaterial({ color: creamWhite });
        const borderBall = new THREE.Mesh(borderGeo, borderMat);
        borderBall.position.set(
            Math.sin(bAngle) * 1.55,
            1.05,
            Math.cos(bAngle) * 1.55
        );
        sliceGroup.add(borderBall);
    }

    // --- Вишенка сверху ---
    const cherryGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const cherryMat = new THREE.MeshStandardMaterial({
        color: cherryColor,
        roughness: 0.2,
        metalness: 0.1
    });
    const cherry = new THREE.Mesh(cherryGeo, cherryMat);
    cherry.position.set(
        Math.sin(midAngle) * 1.3,
        1.15,
        Math.cos(midAngle) * 1.3
    );
    cherry.castShadow = true;
    sliceGroup.add(cherry);

    // --- Листочек вишенки ---
    const leafGeo = new THREE.SphereGeometry(0.08, 8, 8);
    leafGeo.scale(1, 0.3, 1.5);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(
        Math.sin(midAngle) * 1.35,
        1.25,
        Math.cos(midAngle) * 1.35
    );
    leaf.rotation.y = midAngle;
    sliceGroup.add(leaf);

    // --- Стебелёк вишенки ---
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(
        Math.sin(midAngle) * 1.33,
        1.32,
        Math.cos(midAngle) * 1.33
    );
    sliceGroup.add(stem);

    // Позиционируем весь кусок
    sliceGroup.rotation.y = -midAngle; // Корректируем поворот для правильного отображения

    slices.push(sliceGroup);
    cakeGroup.add(sliceGroup);
}

// ===== НАНЕСЕНИЕ КРЕМА МЕЖДУ СЛОЯМИ (декор) =====
// Добавляем кремовые полоски по бокам торта
for (let i = 0; i < SLICES_COUNT; i++) {
    const angle = i * sliceAngle;
    const dripGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.3, 8);
    const dripMat = new THREE.MeshStandardMaterial({ color: creamColor });
    const drip = new THREE.Mesh(dripGeo, dripMat);
    drip.position.set(
        Math.sin(angle) * 1.7,
        0.7,
        Math.cos(angle) * 1.7
    );
    cakeGroup.add(drip);
}

// ===== RAYCASTER (для кликов по кускам) =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ===== АНИМАЦИЯ ИСЧЕЗНОВЕНИЯ КУСКА =====
const disappearingSlices = [];

function removeSlice(sliceGroup) {
    if (!sliceGroup.userData.isSlice || sliceGroup.userData.removing) return;

    sliceGroup.userData.removing = true;
    slicesLeft--;
    document.getElementById('counter').textContent = `Осталось кусочков: ${slicesLeft}`;

    disappearingSlices.push({
        group: sliceGroup,
        scale: 1.0,
        opacity: 1.0
    });
}

// ===== ОБРАБОТКА КЛИКА =====
renderer.domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Собираем все меши всех кусков
    const allMeshes = [];
    slices.forEach(s => {
        s.traverse(child => {
            if (child.isMesh) allMeshes.push(child);
        });
    });

    const intersects = raycaster.intersectObjects(allMeshes);

    if (intersects.length > 0) {
        // Находим родительскую группу куска
        let target = intersects[0].object;
        while (target.parent && !target.userData.isSlice) {
            target = target.parent;
        }
        if (target.userData.isSlice) {
            removeSlice(target);
        }
    }
});

// ===== ПРОВЕРКА ПОБЕДЫ =====
function checkWin() {
    if (slicesLeft <= 0) {
        setTimeout(() => {
            document.getElementById('win-screen').classList.remove('hidden');
        }, 800);
    }
}

// ===== АНИМАЦИОННЫЙ ЦИКЛ =====
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Анимация исчезающих кусков
    for (let i = disappearingSlices.length - 1; i >= 0; i--) {
        const item = disappearingSlices[i];
        item.scale -= 0.02;
        item.group.scale.setScalar(Math.max(0, item.scale));

        if (item.scale <= 0) {
            cakeGroup.remove(item.group);
            disappearingSlices.splice(i, 1);
            checkWin();
        }
    }

    // Лёгкое покачивание торта
    cakeGroup.rotation.y += 0.002;

    renderer.render(scene, camera);
}

animate();

// ===== РЕСАЙЗ ОКНА =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
            }, 500);
        }
    }, 4000);
});


// === КНОПКА "ВЕРНУТЬСЯ" ===
document.getElementById('return-btn').addEventListener('click', () => {
    congratsScreen.style.display = 'none';
    wheelContainer.style.display = 'block';
    title.textContent = 'Крути барабан! 🎡';
});
