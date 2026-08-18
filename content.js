// Слушаем сообщения от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setSpeed') {
        try {
            const video = document.querySelector('video');
            if (video) {
                video.playbackRate = message.speed;

                // Визуальный эффект на странице — мигание иконки скорости
                const speedButton = document.querySelector('.ytp-speed-button');
                if (speedButton) {
                    speedButton.style.transition = 'transform 0.2s';
                    speedButton.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        speedButton.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        } catch (e) {
            console.warn('Не удалось установить скорость:', e);
        }
    }

    if (message.action === 'getSpeed') {
        try {
            const video = document.querySelector('video');
            const speed = video ? video.playbackRate : 1;
            sendResponse({ speed: speed });
        } catch (e) {
            sendResponse({ speed: 1 });
        }
    }
});
