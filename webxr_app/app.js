/**
 * Скрипт управления интерактивным WebXR 3D-демонстратором электровоза 3ЭС5К «Ермак»
 * Дисциплина: Моделирование виртуальной и дополненной реальности (ДВГУПС, Кафедра ЦТИГ)
 */

document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('ermakViewer');
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressContainer = document.querySelector('.progress-bar-container');
    const viewerContainer = document.querySelector('.viewer-container');

    // -------------------------------------------------------------
    // 1. ИНДИКАТОР ЗАГРУЗКИ 3D-МОДЕЛИ
    // -------------------------------------------------------------
    viewer.addEventListener('progress', (e) => {
        const percent = Math.round(e.detail.totalProgress * 100);
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (percent >= 100) {
            setTimeout(() => {
                if (progressContainer) {
                    progressContainer.style.opacity = '0';
                    setTimeout(() => progressContainer.style.display = 'none', 300);
                }
            }, 300);
        }
    });

    // -------------------------------------------------------------
    // 2. БЫСТРЫЕ РАКУРСЫ КАМЕРЫ (PRESETS)
    // -------------------------------------------------------------
    const camButtons = document.querySelectorAll('.cam-btn');
    camButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            camButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const orbit = btn.getAttribute('data-orbit');
            const target = btn.getAttribute('data-target');

            if (orbit) viewer.cameraOrbit = orbit;
            if (target) viewer.cameraTarget = target;
        });
    });

    // -------------------------------------------------------------
    // 3. ИНТЕРАКТИВНЫЕ ХОТСПОТЫ (ИНФО-ТОЧКИ)
    // -------------------------------------------------------------
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(spot => {
        spot.addEventListener('click', (e) => {
            e.stopPropagation();
            const orbit = spot.getAttribute('data-orbit');
            const target = spot.getAttribute('data-target');

            if (orbit) viewer.cameraOrbit = orbit;
            if (target) viewer.cameraTarget = target;

            // Переключение активного хотспота
            hotspots.forEach(h => {
                if (h !== spot) h.classList.remove('active');
            });
            spot.classList.toggle('active');
        });
    });

    // Клик по свободной области закрывает карточки хотспотов
    viewer.addEventListener('click', () => {
        hotspots.forEach(h => h.classList.remove('active'));
    });

    // -------------------------------------------------------------
    // 4. ПАНЕЛЬ ИНСТРУМЕНТОВ
    // -------------------------------------------------------------
    // 4.1. Автоматическое вращение 360°
    const toggleRotateBtn = document.getElementById('toggleRotateBtn');
    if (toggleRotateBtn) {
        toggleRotateBtn.addEventListener('click', () => {
            viewer.autoRotate = !viewer.autoRotate;
            toggleRotateBtn.classList.toggle('active', viewer.autoRotate);
        });
    }

    // 4.2. Показать / скрыть аннотации
    const toggleHotspotsBtn = document.getElementById('toggleHotspotsBtn');
    if (toggleHotspotsBtn) {
        toggleHotspotsBtn.addEventListener('click', () => {
            viewerContainer.classList.toggle('hotspots-hidden');
            const isVisible = !viewerContainer.classList.contains('hotspots-hidden');
            toggleHotspotsBtn.classList.toggle('active', isVisible);
        });
    }

    // 4.3. Освещение: День / Ночь (подсветка фар)
    const toggleLightBtn = document.getElementById('toggleLightBtn');
    let isNightMode = false;
    if (toggleLightBtn) {
        toggleLightBtn.addEventListener('click', () => {
            isNightMode = !isNightMode;
            if (isNightMode) {
                viewer.exposure = 0.35;
                viewer.shadowIntensity = 0.4;
                toggleLightBtn.innerHTML = '<span class="icon">🌙</span> Ночь';
                toggleLightBtn.classList.add('active');
            } else {
                viewer.exposure = 1.05;
                viewer.shadowIntensity = 1.5;
                toggleLightBtn.innerHTML = '<span class="icon">☀️</span> Свет';
                toggleLightBtn.classList.remove('active');
            }
        });
    }

    // 4.4. Сброс положения камеры
    const resetCamBtn = document.getElementById('resetCamBtn');
    if (resetCamBtn) {
        resetCamBtn.addEventListener('click', () => {
            viewer.cameraOrbit = '45deg 75deg 18m';
            viewer.cameraTarget = '0m 2.2m 0m';
            viewer.fieldOfView = '35deg';
            camButtons.forEach(b => b.classList.remove('active'));
            if (camButtons[0]) camButtons[0].classList.add('active');
        });
    }

    // 4.5. Полноэкранный режим
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Fullscreen error: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 5. БОКОВАЯ ПАНЕЛЬ ТТХ (DRAWER)
    // -------------------------------------------------------------
    const toggleInfoBtn = document.getElementById('toggleInfoBtn');
    const closeInfoBtn = document.getElementById('closeInfoBtn');
    const infoDrawer = document.getElementById('infoDrawer');

    if (toggleInfoBtn && infoDrawer) {
        toggleInfoBtn.addEventListener('click', () => {
            infoDrawer.classList.toggle('open');
        });
    }

    if (closeInfoBtn && infoDrawer) {
        closeInfoBtn.addEventListener('click', () => {
            infoDrawer.classList.remove('open');
        });
    }

    // -------------------------------------------------------------
    // 6. ЗВУК ТИФОНА ЭЛЕКТРОВОЗА (Web Audio API)
    // -------------------------------------------------------------
    const hornBtn = document.getElementById('hornBtn');
    let audioCtx = null;

    function playLocomotiveHorn() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const duration = 1.4;

            // Двухтональный пневмотифон локомотива РЖД (Т-9): основные тона ~370 Гц и ~660 Гц + субгармоники
            const freqs = [370, 374, 660, 665, 185];
            const masterGain = audioCtx.createGain();

            masterGain.gain.setValueAtTime(0.001, now);
            masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.12);
            masterGain.gain.setValueAtTime(0.35, now + duration - 0.25);
            masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            masterGain.connect(audioCtx.destination);

            freqs.forEach(f => {
                const osc = audioCtx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now);
                osc.connect(masterGain);
                osc.start(now);
                osc.stop(now + duration);
            });
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    if (hornBtn) {
        hornBtn.addEventListener('click', () => {
            playLocomotiveHorn();
            hornBtn.style.transform = 'scale(0.95)';
            setTimeout(() => hornBtn.style.transform = '', 150);
        });
    }

    // -------------------------------------------------------------
    // 7. МОДАЛЬНОЕ ОКНО AR И ГЕНЕРАЦИЯ QR-КОДА
    // -------------------------------------------------------------
    const arLaunchBtn = document.getElementById('arLaunchBtn');
    const arModal = document.getElementById('arModal');
    const closeArModalBtn = document.getElementById('closeArModalBtn');
    const directArBtn = document.getElementById('directArBtn');
    const qrContainer = document.getElementById('qrCodeContainer');

    function generateSimpleQR(url) {
        // Создаем четкий SVG QR-код через свободный API qrcode
        const encodedUrl = encodeURIComponent(url);
        const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}&margin=6`;
        qrContainer.innerHTML = `<img src="${qrApi}" alt="QR-код для WebAR" width="180" height="180" style="display:block; border-radius:8px;">`;
    }

    if (arLaunchBtn) {
        arLaunchBtn.addEventListener('click', () => {
            if (viewer.canActivateAR) {
                viewer.activateAR();
            } else if (arModal) {
                const currentUrl = window.location.href;
                generateSimpleQR(currentUrl);
                arModal.classList.add('open');
            }
        });
    }

    if (closeArModalBtn && arModal) {
        closeArModalBtn.addEventListener('click', () => {
            arModal.classList.remove('open');
        });
    }

    if (arModal) {
        arModal.addEventListener('click', (e) => {
            if (e.target === arModal) arModal.classList.remove('open');
        });
    }

    if (directArBtn) {
        directArBtn.addEventListener('click', () => {
            if (viewer.canActivateAR) {
                viewer.activateAR();
            } else {
                alert('Режим WebXR AR доступен на поддерживаемых мобильных устройствах Android (с ARCore) и iOS (Quick Look). Отсканируйте QR-код смартфоном.');
            }
        });
    }
});
