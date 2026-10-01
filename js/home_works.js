// ===== SAVED DESTINATIONS (Bucket List / Избранные маршруты) =====

const destInput = document.querySelector('#dest_input');
const destButton = document.querySelector('#dest_button');
const savedList = document.querySelector('#saved_list');

let savedDestinations = JSON.parse(localStorage.getItem('kyrgyz_saved') || '[]');

const renderSaved = () => {
    if (!savedList) return;
    savedList.innerHTML = '';
    
    if (savedDestinations.length === 0) {
        savedList.innerHTML = `<div class="empty_saved">
            <span style="font-size:36px; display:block; margin-bottom:12px;">🗺️</span>
            <p>Ваша карта мечты пуста.<br>Добавьте места, в которых хотите побывать!</p>
        </div>`;
        return;
    }
    
    savedDestinations.forEach((dest, i) => {
        const item = document.createElement('div');
        item.className = 'saved_item';
        item.innerHTML = `
            <span>📍 ${dest}</span>
            <button class="remove-btn" data-index="${i}" title="Удалить из списка">✕</button>
        `;
        savedList.appendChild(item);
    });

    savedList.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            savedDestinations.splice(Number(btn.dataset.index), 1);
            localStorage.setItem('kyrgyz_saved', JSON.stringify(savedDestinations));
            renderSaved();
        };
    });
};

// Initial render
if (savedList) {
    renderSaved();
}

if (destButton) {
    destButton.onclick = () => {
        if (!destInput) return;
        const val = destInput.value.trim();
        if (!val) return;
        savedDestinations.push(val);
        localStorage.setItem('kyrgyz_saved', JSON.stringify(savedDestinations));
        destInput.value = '';
        renderSaved();
    };
}

if (destInput && destButton) {
    destInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') destButton.click();
    });
}

// ===== MOVING EXPEDITION RADAR (Airplane Flight Track) =====

const child = document.querySelector('.child_block');
const parentBlock = document.querySelector('.parent_block');

if (child && parentBlock) {
    const planeSize = 52;

    let positionX = 0;
    let positionY = 0;
    let trailTimer = 0;

    const move = () => {
        const size = parentBlock.clientWidth;
        const maxPos = Math.max(size - planeSize, 0);

        if (positionX < maxPos && positionY === 0) {
            positionX += 2;
            child.style.left = `${positionX}px`;
            child.style.transform = 'rotate(90deg)'; // flying right
        } else if (positionX >= maxPos && positionY < maxPos) {
            positionY += 2;
            child.style.top = `${positionY}px`;
            child.style.transform = 'rotate(180deg)'; // flying down
        } else if (positionY >= maxPos && positionX > 0) {
            positionX -= 2;
            child.style.left = `${positionX}px`;
            child.style.transform = 'rotate(270deg)'; // flying left
        } else if (positionX === 0 && positionY > 0) {
            positionY -= 2;
            child.style.top = `${positionY}px`;
            child.style.transform = 'rotate(0deg)'; // flying up
        }

        trailTimer++;
        if (trailTimer % 5 === 0) {
            const trail = document.createElement('div');
            trail.className = 'trail';
            trail.style.left = `${positionX + planeSize / 2 - 4}px`;
            trail.style.top = `${positionY + planeSize / 2 - 4}px`;
            parentBlock.appendChild(trail);
            setTimeout(() => trail.remove(), 1000);
        }

        requestAnimationFrame(move);
    };

    // Begin loop
    move();
}

// ===== STOPWATCH / SUMMIT CHRONOMETER =====

const secondsDisplay = document.querySelector('#seconds');
const minutesDisplay = document.querySelector('#minutes');
const hoursDisplay = document.querySelector('#hours');
const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
const resetBtn = document.querySelector('#reset');

let totalSeconds = 0;
let interval = null;

const formatTime = (n) => String(n).padStart(2, '0');

const updateDisplay = () => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (hoursDisplay) hoursDisplay.textContent = formatTime(h);
    if (minutesDisplay) minutesDisplay.textContent = formatTime(m);
    if (secondsDisplay) secondsDisplay.textContent = formatTime(s);
};

if (startBtn) {
    startBtn.onclick = () => {
        if (!interval) {
            interval = setInterval(() => {
                totalSeconds++;
                updateDisplay();
            }, 1000);
            
            // Add subtle active state style to Start button if desired
            startBtn.style.background = 'var(--gold)';
            startBtn.style.color = 'var(--bg-dark)';
            if (stopBtn) {
                stopBtn.style.background = 'transparent';
                stopBtn.style.color = 'var(--text-light)';
            }
        }
    };
}

if (stopBtn) {
    stopBtn.onclick = () => {
        clearInterval(interval);
        interval = null;
        if (startBtn) {
            startBtn.style.background = 'transparent';
            startBtn.style.color = 'var(--text-light)';
        }
        stopBtn.style.background = 'var(--gold)';
        stopBtn.style.color = 'var(--bg-dark)';
    };
}

if (resetBtn) {
    resetBtn.onclick = () => {
        clearInterval(interval);
        interval = null;
        totalSeconds = 0;
        updateDisplay();
        if (startBtn) {
            startBtn.style.background = 'transparent';
            startBtn.style.color = 'var(--text-light)';
        }
        if (stopBtn) {
            stopBtn.style.background = 'transparent';
            stopBtn.style.color = 'var(--text-light)';
        }
    };
}
