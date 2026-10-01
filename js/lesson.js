// ===== REGION SEARCH CHECKER =====

const regionInput = document.querySelector('#region_input');
const regionButton = document.querySelector('#region_button');
const regionResult = document.querySelector('#region_result');

const validRegions = [
    'бишкек', 'ош', 'иссык-куль', 'каракол', 'нарын',
    'джалал-абад', 'баткен', 'чуй', 'талас', 'чолпон-ата'
];

if (regionButton) {
    regionButton.addEventListener('click', () => {
        if (!regionInput || !regionResult) return;
        const val = regionInput.value.trim().toLowerCase();
        
        if (!val) {
            regionResult.innerHTML = '';
            return;
        }

        if (validRegions.includes(val)) {
            regionResult.innerHTML = '✓ Доступно';
            regionResult.style.color = '#34d399'; // Emerald
        } else {
            regionResult.innerHTML = '✗ Не найдено';
            regionResult.style.color = '#f87171'; // Red
        }
    });
}

if (regionInput && regionButton) {
    regionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') regionButton.click();
    });
}

// ===== REGION TABS (Guidebook) =====

const tabItems = document.querySelectorAll('.tab_content_item');
const tabContent = document.querySelector('#tab_content_text');
const tabTitle = document.querySelector('#tab_content_title');
const tabImg = document.querySelector('#tab_content_img');
const tabImgContainer = document.querySelector('#tab_content_img_container');

const regionData = {
    'issyk': {
        title: '🌊 Иссык-Куль — Высокогорное море',
        text: 'Иссык-Куль — чистейшее высокогорное озеро на северо-востоке Кыргызстана, второе по величине соленое озеро в мире. Окружённое заснеженными хребтами Тянь-Шаня, оно никогда не замерзает благодаря глубинной геотермальной активности. Прекрасные песчаные пляжи, термальные спа и уникальный микроклимат делают его главным курортным центром страны.',
        img: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake%20Issyk-Kul%2C%20Kyrgyzstan.jpg',
    },
    'ala-archa': {
        title: '🏔️ Ала-Арча — Ущелье великанов',
        text: 'Национальный парк Ала-Арча раскинулся в живописном ущелье всего в 40 километрах от Бишкека. Бурные ледниковые реки, вековые тянь-шаньские ели, водопады и суровые скалистые вершины высотой до 4895 метров привлекают сюда тысячи альпинистов и любителей треккинга. Здесь обитают редкие горные барсы и архары.',
        img: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ala%20archa.JPG',
    },
    'osh': {
        title: '🏙️ Ош — Сердце Великого Шёлкового Пути',
        text: 'Ош — древнейший город Центральной Азии с историей, превышающей 3000 лет. Главное сокровище города — священная гора Сулайман-Тоо, возвышающаяся прямо в центре города и входящая в список Всемирного наследия ЮНЕСКО. Ошский базар Джайма сохраняет неповторимую атмосферу восточной торговли со времен караванов.',
        img: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Osh%2003-2016%20img06%20Sulayman%20Mountain.jpg',
    },
    'song-kol': {
        title: '⛺ Сон-Куль — Обитель кочевников',
        text: 'Сон-Куль — заповедное озеро, скрытое на высоте 3016 метров среди альпийских лугов. Летом чабаны пригоняют сюда стада лошадей и устанавливают традиционные юрты. Это идеальное место для погружения в кочевой быт, катания верхом, дегустации кумыса и созерцания невероятно яркого млечного пути в полном удалении от цивилизации.',
        img: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Song-Kul%2C%20Kyrgyzstan%20%2843670184405%29.jpg',
    },
    'karakol': {
        title: '🌸 Каракол — Культурный оазис востока',
        text: 'Каракол — туристическая мекка у подножия высочайших хребтов. Город славится уникальной Дунганской деревянной мечетью, построенной без единого гвоздя, и Свято-Троицким православным собором. Отсюда начинаются грандиозные горные экспедиции к ледникам Алтын-Арашан и высочайшим пикам Хан-Тенгри и Победы.',
        img: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Karakol%20cathedral.jpg',
    },
};

if (tabItems.length > 0) {
    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            tabItems.forEach(t => t.classList.remove('tab_content_item_active'));
            item.classList.add('tab_content_item_active');
            
            const key = item.dataset.key;
            if (regionData[key]) {
                // Subtle fade in effect for text content and image
                if (tabTitle) {
                    tabTitle.style.opacity = 0;
                    setTimeout(() => {
                        tabTitle.textContent = regionData[key].title;
                        tabTitle.style.opacity = 1;
                    }, 150);
                }
                if (tabContent) {
                    tabContent.style.opacity = 0;
                    setTimeout(() => {
                        tabContent.textContent = regionData[key].text;
                        tabContent.style.opacity = 1;
                    }, 150);
                }
                if (tabImgContainer && tabImg) {
                    tabImgContainer.style.opacity = 0;
                    setTimeout(() => {
                        tabImg.src = regionData[key].img;
                        tabImg.alt = regionData[key].title;
                        tabImgContainer.style.opacity = 1;
                    }, 150);
                }
            }
        });
    });
    
    // Add transition style to elements
    if (tabTitle) tabTitle.style.transition = 'opacity 0.2s ease-in-out';
    if (tabContent) tabContent.style.transition = 'opacity 0.2s ease-in-out';
    
    // Activate the first tab
    tabItems[0].click();
}

// ===== SEASON CARDS SWITCHER =====

const cardItems = document.querySelectorAll('.card');
const cardPrev = document.querySelector('#card_prev');
const cardNext = document.querySelector('#card_next');
let cardIndex = 1; // Default to 'Summer'

if (cardItems.length > 0) {
    const showCard = (i) => {
        cardItems.forEach((c, idx) => {
            if (idx === i) {
                c.style.opacity = '1';
                c.style.transform = 'scale(1.05)';
                c.style.borderColor = 'var(--gold)';
                c.style.boxShadow = '0 15px 30px -10px color-mix(in srgb, var(--gold) 30%, transparent)';
            } else {
                c.style.opacity = '0.4';
                c.style.transform = 'scale(1)';
                c.style.borderColor = 'var(--border-glass)';
                c.style.boxShadow = 'none';
            }
        });
    };
    
    // Apply styling transition for smooth experience
    cardItems.forEach(c => {
        c.style.transition = 'var(--transition-smooth)';
    });

    showCard(cardIndex);

    if (cardNext) {
        cardNext.onclick = () => {
            cardIndex = cardIndex < cardItems.length - 1 ? cardIndex + 1 : 0;
            showCard(cardIndex);
        };
    }
    
    if (cardPrev) {
        cardPrev.onclick = () => {
            cardIndex = cardIndex > 0 ? cardIndex - 1 : cardItems.length - 1;
            showCard(cardIndex);
        };
    }
}

// ===== CURRENCY CONVERTER (KGS ↔ USD/EUR/RUB/KZT) =====

const amountInput = document.querySelector('#amount_input');
const fromCurrency = document.querySelector('#from_currency');
const convertBtn = document.querySelector('#convert_btn');
const convertResult = document.querySelector('#convert_result');
const convertNote = document.querySelector('#convert_note');

// Average real rates against KGS
const rates = {
    USD: 88.50,
    EUR: 95.20,
    RUB: 0.97,
    KZT: 0.19,
};

if (convertBtn) {
    convertBtn.onclick = () => {
        if (!amountInput || !convertResult) return;
        
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency ? fromCurrency.value : 'USD';
        
        if (isNaN(amount) || amount <= 0) {
            convertResult.textContent = '—';
            if (convertNote) convertNote.textContent = 'Введите корректную сумму';
            return;
        }
        
        const rate = rates[from] || 1;
        const kgs = amount * rate;
        const usdEquivalent = (kgs / rates['USD']).toFixed(2);
        
        // Render beautiful output
        convertResult.textContent = `${Math.round(kgs).toLocaleString('ru')} сом`;
        if (convertNote) {
            convertNote.textContent = `≈ ${usdEquivalent} USD · Курсы носят ориентировочный характер`;
        }
    };
    
    // Automatic trigger on load
    convertBtn.click();
}
