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

// === ОБРАБОТКА КЛИКА ПО КНОПКЕ "КРУТИТЬ" ===
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

        // СЕКТОР 1: Поздравление
        if (sector === 1) {
            setTimeout(() => {
                wheelContainer.style.display = 'none';
                resultEl.textContent = '';
                congratsScreen.style.display = 'block';
                title.textContent = 'С Днём Рождения!';
            }, 500);
        }
        
        // СЕКТОР 2: Торт
        if (sector === 2) {
            setTimeout(() => {
                wheelContainer.style.display = 'none';
                resultEl.textContent = '';
                document.getElementById('cake-screen').style.display = 'block';
                title.textContent = 'Съешь весь торт! 🎂';
                initCake();
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

// ===== ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ТОРТА =====
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
    const SLICES_COUNT = 8;
    slicesLeft = SLICES_COUNT;
    slices = [];
    disappearingSlices = [];

    // Обновляем счётчик
    const counter = document.getElementById('counter');
    if (counter) counter.textContent = `Осталось кусочков: ${slicesLeft}`;

    // Создаём сцену
    cakeScene = new THREE.Scene();
    cakeScene.background = new THREE.Color(0xfce4ec);

    // Камера
    cakeCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    cakeCamera.position.set(0, 5, 8); // Чуть выше и дальше
    cakeCamera.lookAt(0, 0.5, 0);

    // Рендерер
    cakeRenderer = new THREE.WebGLRenderer({ antialias: true });
    cakeRenderer.setSize(window.innerWidth, window.innerHeight);
    cakeRenderer.shadowMap.enabled = true;
    cakeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const cakeSceneEl = document.getElementById('cake-scene');
    if (cakeSceneEl) {
        // Очищаем от старого canvas
        while (cakeSceneEl.firstChild) {
            cakeSceneEl.removeChild(cakeSceneEl.firstChild);
        }
        // Добавляем заголовок и подсказку обратно
        const counterEl = document.createElement('h2');
        counterEl.id = 'counter';
        counterEl.textContent = `Осталось кусочков: ${slicesLeft}`;
        cakeSceneEl.appendChild(counterEl);
        
        const hintEl = document.createElement('p');
        hintEl.className = 'hint';
        hintEl.textContent = '🖱️ Крути мышкой · 🖱️ Кликай по куску торта';
        cakeSceneEl.appendChild(hintEl);
        
        cakeSceneEl.appendChild(cakeRenderer.domElement);
    }

    // Контролы (ТОЛЬКО РУЧНОЕ ВРАЩЕНИЕ, без авто)
    cakeControls = new THREE.OrbitControls(cakeCamera, cakeRenderer.domElement);
    cakeControls.enableDamping = true;
    cakeControls.dampingFactor = 0.08;
    cakeControls.maxPolarAngle = Math.PI / 2.1;
    cakeControls.minDistance = 4;
    cakeControls.maxDistance = 15;
    cakeControls.autoRotate = false; // ✅ ОТКЛЮЧАЕМ АВТОВОЩЕНИЕ
    cakeControls.enablePan = false;

    // Свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    cakeScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    cakeScene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffb6c1, 0.3);
    backLight.position.set(-3, 3, -5);
    cakeScene.add(backLight);

    // Стол
    const tableGeo = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x8B6F47 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.1;
    table.receiveShadow = true;
    cakeScene.add(table);

    // Тарелка
    const plateGeo = new THREE.CylinderGeometry(3, 3, 0.08, 32);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = 0.04;
    plate.receiveShadow = true;
    cakeScene.add(plate);

    // Группа торта
    cakeGroup = new THREE.Group();
    cakeScene.add(cakeGroup);

    const sliceAngle = (Math.PI * 2) / SLICES_COUNT;
    const cakeColor = 0xF4A460;
    const creamColor = 0xFFB6C1;
    const cherryColor = 0xDC143C;
    const creamWhite = 0xFFF5EE;

    // Создаём все куски СРАЗУ
    for (let i = 0; i < SLICES_COUNT; i++) {
        const startAngle = i * sliceAngle;
        const midAngle = startAngle + sliceAngle / 2;

        const sliceGroup = new THREE.Group();
        sliceGroup.userData = { sliceIndex: i, isSlice: true };

        // Бисквит
        const spongeGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.8, 32, 1, true, startAngle, sliceAngle);
        const spongeMat = new THREE.MeshStandardMaterial({ color: cakeColor, side: THREE.DoubleSide, roughness: 0.8 });
        const sponge = new THREE.Mesh(spongeGeo, spongeMat);
        sponge.position.y = 0.5;
        sponge.castShadow = true;
        sliceGroup.add(sponge);

        // Крышка
        const topGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 32, 1, true, startAngle, sliceAngle);
        const topMat = new THREE.MeshStandardMaterial({ color: 0xD2691E, side: THREE.DoubleSide });
        const topCover = new THREE.Mesh(topGeo, topMat);
        topCover.position.y = 0.9;
        sliceGroup.add(topCover);

        // Стенка
        const innerWallGeo = new THREE.PlaneGeometry(0.8, 1.8);
        const innerWallMat = new THREE.MeshStandardMaterial({ color: cakeColor, side: THREE.DoubleSide });
        const innerWall = new THREE.Mesh(innerWallGeo, innerWallMat);
        innerWall.position.set(Math.sin(midAngle) * 0.05, 0.5, Math.cos(midAngle) * 0.05);
        innerWall.rotation.y = midAngle;
        sliceGroup.add(innerWall);

        // Крем
        const creamGeo = new THREE.CylinderGeometry(1.75, 1.75, 0.15, 32, 1, true, startAngle + 0.02, sliceAngle - 0.04);
        const creamMat = new THREE.MeshStandardMaterial({ color: creamColor, roughness: 0.4 });
        const cream = new THREE.Mesh(creamGeo, creamMat);
        cream.position.y = 0.95;
        cream.castShadow = true;
        sliceGroup.add(cream);

        // Бордюр из крема
        const borderCount = 5;
        for (let b = 0; b < borderCount; b++) {
            const bAngle = startAngle + (sliceAngle / (borderCount + 1)) * (b + 1);
            const borderGeo = new THREE.SphereGeometry(0.12, 16, 16);
            const borderMat = new THREE.MeshStandardMaterial({ color: creamWhite });
            const borderBall = new THREE.Mesh(borderGeo, borderMat);
            borderBall.position.set(Math.sin(bAngle) * 1.55, 1.05, Math.cos(bAngle) * 1.55);
            sliceGroup.add(borderBall);
        }

        // Вишенка
        const cherryGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const cherryMat = new THREE.MeshStandardMaterial({ color: cherryColor, roughness: 0.2, metalness: 0.1 });
        const cherry = new THREE.Mesh(cherryGeo, cherryMat);
        cherry.position.set(Math.sin(midAngle) * 1.3, 1.15, Math.cos(midAngle) * 1.3);
        cherry.castShadow = true;
        sliceGroup.add(cherry);

        // Листочек
        const leafGeo = new THREE.SphereGeometry(0.08, 8, 8);
        leafGeo.scale(1, 0.3, 1.5);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(Math.sin(midAngle) * 1.35, 1.25, Math.cos(midAngle) * 1.35);
        leaf.rotation.y = midAngle;
        sliceGroup.add(leaf);

        // Стебелёк
        const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.set(Math.sin(midAngle) * 1.33, 1.32, Math.cos(midAngle) * 1.33);
        sliceGroup.add(stem);

        sliceGroup.rotation.y = -midAngle;
        slices.push(sliceGroup);
        cakeGroup.add(sliceGroup); // ✅ ДОБАВЛЯЕМ кусок в сцену СРАЗУ
    }

    // Крем по бокам торта
    for (let i = 0; i < SLICES_COUNT; i++) {
        const angle = i * sliceAngle;
        const dripGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.3, 8);
        const dripMat = new THREE.MeshStandardMaterial({ color: creamColor });
        const drip = new THREE.Mesh(dripGeo, dripMat);
        drip.position.set(Math.sin(angle) * 1.7, 0.7, Math.cos(angle) * 1.7);
        cakeGroup.add(drip);
    }

    // Raycaster для кликов
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function removeSlice(sliceGroup) {
        if (!sliceGroup.userData.isSlice || sliceGroup.userData.removing) return;
        sliceGroup.userData.removing = true;
        slicesLeft--;
        const counter = document.getElementById('counter');
        if (counter) counter.textContent = `Осталось кусочков: ${slicesLeft}`;
        disappearingSlices.push({ group: sliceGroup, scale: 1.0 });
    }

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
            if (target.userData.isSlice) {
                removeSlice(target);
            }
        }
    });

    function checkWin() {
        if (slicesLeft <= 0) {
            setTimeout(() => {
                const winScreen = document.getElementById('win-screen');
                if (winScreen) winScreen.classList.remove('hidden');
            }, 800);
        }
    }

    // Анимация (БЕЗ АВТОВОЩЕНИЯ)
    function animate() {
        animationId = requestAnimationFrame(animate);
        cakeControls.update();

        // Анимация исчезновения кусков
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

        // ✅ УБРАЛ: cakeGroup.rotation.y += 0.002;
        
        cakeRenderer.render(cakeScene, cakeCamera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        if (cakeCamera && cakeRenderer) {
            cakeCamera.aspect = window.innerWidth / window.innerHeight;
            cakeCamera.updateProjectionMatrix();
            cakeRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
}

// === КНОПКА "ВЕРНУТЬСЯ К КОЛЕСУ" ===
const backToWheelBtn = document.getElementById('back-to-wheel-btn');
if (backToWheelBtn) {
    backToWheelBtn.addEventListener('click', () => {
        document.getElementById('cake-screen').style.display = 'none';
        document.getElementById('win-screen').classList.add('hidden');
        wheelContainer.style.display = 'block';
        title.textContent = 'Крути барабан! 🎡';
        
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