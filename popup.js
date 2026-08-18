const slider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const status = document.getElementById('status');
const presetBtns = document.querySelectorAll('.preset-btn');

// Загрузка сохранённой скорости
const savedSpeed = localStorage.getItem('ytSpeed') || '1';
let currentSpeed = parseFloat(savedSpeed);

// Обновление UI при загрузке
updateUI(currentSpeed);

// Проверка, открыт ли YouTube
checkYouTubeTab();

// Слайдер
slider.addEventListener('input', (e) => {
    currentSpeed = parseFloat(e.target.value);
    updateUI(currentSpeed);
    applySpeed(currentSpeed);
});

// Пресеты
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentSpeed = parseFloat(btn.dataset.speed);
        slider.value = currentSpeed;
        updateUI(currentSpeed);
        applySpeed(currentSpeed);
    });
});

function updateUI(speed) {
    speedValue.textContent = speed.toFixed(1);
    slider.value = speed;

    // Подсветка активного пресета
    presetBtns.forEach(btn => {
        btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });
}

function applySpeed(speed) {
    localStorage.setItem('ytSpeed', speed.toString());

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'setSpeed', speed: speed });
        }
    });
}

function checkYouTubeTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
            status.textContent = 'YouTube активен';
            status.classList.add('youTube');

            // Запрос текущей скорости от content script
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getSpeed' }, (response) => {
                if (response && response.speed) {
                    currentSpeed = response.speed;
                    updateUI(currentSpeed);
                }
            });
        } else {
            status.textContent = 'Откройте YouTube';
        }
    });
}
