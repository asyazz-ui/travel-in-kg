// ===== SHARED LOADER =====

const ensureSiteLoader = () => {
    if (document.querySelector('.site-loader')) return document.querySelector('.site-loader');

    const loader = document.createElement('div');
    loader.className = 'site-loader';
    loader.innerHTML = `
        <div class="site-loader_inner">
            <div class="site-loader_emblem">
                <span class="loader-ring loader-ring_outer"></span>
                <span class="loader-ring loader-ring_inner"></span>
                <span class="loader-core"></span>
                <span class="loader-horizon"></span>
            </div>
            <p class="site-loader_label">Preparing the journey</p>
            <h3 class="site-loader_title">Исследуй Кыргызстан</h3>
        </div>
    `;

    document.body.appendChild(loader);
    requestAnimationFrame(() => loader.classList.add('is-active'));
    return loader;
};

const siteLoader = ensureSiteLoader();

let loaderDismissed = false;
const dismissSiteLoader = () => {
    if (!siteLoader || loaderDismissed) return;
    loaderDismissed = true;
    if (!siteLoader) return;
    siteLoader.classList.add('is-hidden');
    setTimeout(() => siteLoader.remove(), 850);
};

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(dismissSiteLoader, 320);
});

window.addEventListener('load', () => {
    setTimeout(dismissSiteLoader, 120);
});

// ===== SHARED SITE AUDIO =====

const initSiteAudio = () => {
    if (document.querySelector('.site-audio')) return;

    const assetPrefix = window.location.pathname.includes('/pages/') ? '../assets/' : 'assets/';
    const audio = document.createElement('audio');
    const savedTime = parseFloat(sessionStorage.getItem('kyrgyz_audio_time') || '0');
    const audioIntent = sessionStorage.getItem('kyrgyz_audio_intent') === 'true';
    let saveTimer = null;

    audio.className = 'site-audio';
    audio.src = `${assetPrefix}Kyrgyz%20melody.mp3`;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.38;
    audio.playsInline = true;

    const persistTime = () => {
        if (!Number.isNaN(audio.currentTime)) {
            sessionStorage.setItem('kyrgyz_audio_time', String(audio.currentTime));
        }
    };

    const startPersisting = () => {
        if (saveTimer) return;
        saveTimer = window.setInterval(persistTime, 2000);
    };

    const tryPlayAudio = () => {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(() => {
                    sessionStorage.setItem('kyrgyz_audio_intent', 'true');
                    startPersisting();
                    removeResumeListeners();
                })
                .catch(() => {
                    addResumeListeners();
                });
        }
    };

    const resumePlayback = () => {
        sessionStorage.setItem('kyrgyz_audio_intent', 'true');
        tryPlayAudio();
    };

    const resumeEvents = ['click', 'keydown', 'touchstart'];
    const addResumeListeners = () => {
        resumeEvents.forEach((eventName) => {
            document.addEventListener(eventName, resumePlayback, { once: true, passive: true });
        });
    };

    const removeResumeListeners = () => {
        resumeEvents.forEach((eventName) => {
            document.removeEventListener(eventName, resumePlayback, { passive: true });
        });
    };

    audio.addEventListener('loadedmetadata', () => {
        if (savedTime > 0 && savedTime < audio.duration - 1) {
            audio.currentTime = savedTime;
        }

        if (audioIntent) {
            tryPlayAudio();
        } else {
            addResumeListeners();
            tryPlayAudio();
        }
    });

    audio.addEventListener('play', startPersisting);
    audio.addEventListener('pause', persistTime);
    window.addEventListener('pagehide', persistTime);
    window.addEventListener('beforeunload', persistTime);

    document.body.appendChild(audio);
};

window.addEventListener('DOMContentLoaded', initSiteAudio);

// ===== THEME COLOR SWITCHER =====
// Clicking a color button changes the global accent theme color

const buttonsColor = document.querySelectorAll('.btn-color');
const heroTitle = document.querySelector('#js-color');

const travelColors = [
    { color: '#a78253', name: 'Золото' },
    { color: '#2c5f78', name: 'Озеро' },
    { color: '#364f3e', name: 'Горы' },
    { color: '#ab5c4e', name: 'Закат' },
];

const applyColors = () => {
    if (!buttonsColor || buttonsColor.length === 0) return;
    buttonsColor.forEach((btn, i) => {
        const theme = travelColors[i];
        if (!theme) return;
        btn.style.borderColor = theme.color;
        btn.onclick = () => {
            if (heroTitle) {
                heroTitle.style.color = theme.color;
            }
            document.documentElement.style.setProperty('--gold', theme.color);
        };
    });
};

window.addEventListener('load', applyColors);

window.addEventListener('keydown', (event) => {
    if (event.code.toLowerCase() === 'space') {
        // Only trigger if not currently typing in an input field
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        event.preventDefault();
        const rand = travelColors[Math.floor(Math.random() * travelColors.length)];
        if (heroTitle) {
            heroTitle.style.color = rand.color;
        }
        document.documentElement.style.setProperty('--gold', rand.color);
    }
});

// ===== TOUR PACKAGE LINKS =====

const tourButtons = document.querySelectorAll('.tour-trigger');
if (tourButtons.length > 0) {
    tourButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedTour = button.dataset.tour;
            if (!selectedTour) return;
            window.location.href = `pages/tour.html?tour=${encodeURIComponent(selectedTour)}`;
        });
    });
}

// ===== DESTINATION SLIDER =====

const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');
let index = 0;
let sliderInterval = null;

if (slides.length > 0) {
    const hideSlide = () => {
        slides.forEach((slide) => {
            slide.style.opacity = '0';
            slide.classList.remove('active_slide');
        });
    };

    const showSlide = (i = 0) => {
        slides[i].style.opacity = '1';
        slides[i].classList.add('active_slide');
    };

    hideSlide();
    showSlide(index);

    const startAutoSlider = () => {
        if (sliderInterval) clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            index = index < slides.length - 1 ? index + 1 : 0;
            hideSlide();
            showSlide(index);
        }, 8000);
    };

    if (nextBtn) {
        nextBtn.onclick = () => {
            index = index < slides.length - 1 ? index + 1 : 0;
            hideSlide();
            showSlide(index);
            startAutoSlider(); // Reset timer on click
        };
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            index = index > 0 ? index - 1 : slides.length - 1;
            hideSlide();
            showSlide(index);
            startAutoSlider(); // Reset timer on click
        };
    }

    startAutoSlider();
}

// ===== MOUNTAIN PARALLAX =====

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const mountainBg = document.querySelector('.mountain-bg');
    if (mountainBg) {
        mountainBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
});

// ===== SEQUENTIAL TYPEWRITER EFFECT =====

const typeWriterSequential = (prefixEl, highlightEl, prefixText, highlightText, speed) => {
    prefixEl.innerHTML = '';
    highlightEl.innerHTML = '';
    
    prefixEl.classList.remove('typing-done');
    highlightEl.classList.remove('typing-done');
    
    prefixEl.classList.add('typing');
    
    let i = 0;
    
    const typePrefix = () => {
        if (i < prefixText.length) {
            prefixEl.innerHTML += prefixText.charAt(i);
            i++;
            // Human-like speed variance (+/- 35% of speed)
            const organicSpeed = speed + (Math.random() * 50 - 25);
            setTimeout(typePrefix, organicSpeed);
        } else {
            prefixEl.classList.remove('typing');
            prefixEl.classList.add('typing-done');
            
            // Brief natural pause before typing the colored keyword
            setTimeout(() => {
                highlightEl.classList.add('typing');
                let j = 0;
                const typeHighlight = () => {
                    if (j < highlightText.length) {
                        highlightEl.innerHTML += highlightText.charAt(j);
                        j++;
                        const organicSpeed = speed + (Math.random() * 50 - 25);
                        setTimeout(typeHighlight, organicSpeed);
                    } else {
                        highlightEl.classList.remove('typing');
                        highlightEl.classList.add('typing-done');
                    }
                };
                typeHighlight();
            }, 300);
        }
    };
    
    typePrefix();
};

window.addEventListener('DOMContentLoaded', () => {
    // Delay start slightly to align perfectly with the CSS fadeUpIn animation
    setTimeout(() => {
        const prefixEl = document.querySelector('.typewriter-prefix');
        const highlightEl = document.querySelector('#js-color');
        
        if (prefixEl && highlightEl) {
            const prefixText = prefixEl.textContent.trim();
            const highlightText = highlightEl.textContent.trim();
            typeWriterSequential(prefixEl, highlightEl, prefixText, highlightText, 80);
        } else if (highlightEl) {
            // Backwards compatible fallback if prefix span is omitted
            const highlightText = highlightEl.textContent.trim();
            highlightEl.innerHTML = '';
            highlightEl.classList.add('typing');
            let j = 0;
            const typeHighlight = () => {
                if (j < highlightText.length) {
                    highlightEl.innerHTML += highlightText.charAt(j);
                    j++;
                    setTimeout(typeHighlight, 80 + (Math.random() * 50 - 25));
                } else {
                    highlightEl.classList.remove('typing');
                    highlightEl.classList.add('typing-done');
                }
            };
            typeHighlight();
        }
    }, 550);
});

// ===== INTERACTIVE STATS COUNTER COUNT-UPS =====

const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    counters.forEach(counter => {
        const rawText = counter.textContent.trim();
        // Parse numbers out of texts like "94%" or "1606м" or "3000+"
        const match = rawText.match(/^([\d\s]+)(.*)$/);
        if (!match) return;
        
        const targetValue = parseInt(match[1].replace(/\s/g, ''), 10);
        const suffix = match[2] || '';
        
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 1000 / 60; // 60 FPS (16.7ms)
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;
        
        // Easing curve (easeOutCubic)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        
        const counterInterval = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easedProgress = easeOutCubic(progress);
            const currentValue = Math.round(easedProgress * targetValue);
            
            // Render styled number with space thousands separation
            counter.textContent = currentValue.toLocaleString('ru-RU') + suffix;
            
            if (currentFrame >= totalFrames) {
                clearInterval(counterInterval);
                counter.textContent = rawText; // Exact final value
            }
        }, frameRate);
    });
};

// Start stat counters count-up when they load or become visible
window.addEventListener('load', () => {
    setTimeout(animateCounters, 700);
});

// ===== INTERACTIVE SCROLL REVEAL (Intersection Observer) =====

window.addEventListener('DOMContentLoaded', () => {
    const revealSections = document.querySelectorAll('.reveal-section');
    if (revealSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        });
        revealSections.forEach(section => {
            observer.observe(section);
        });
    }
});
