const tourCatalog = {
    'weekend': {
        eyebrow: 'Soft adventure',
        title: 'Юртовый weekend',
        intro: 'Короткий, но насыщенный маршрут для тех, кто хочет быстро почувствовать тишину озер, вкус кочевой культуры и высокогорную панораму без длинной экспедиции.',
        price: '12 500 ₽',
        duration: '3 дня',
        style: 'Легкий luxury escape',
        image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Song-Kul%2C%20Kyrgyzstan%20%2843670184405%29.jpg',
        story: 'Этот пакет подойдет тем, кто едет в Кыргызстан впервые и хочет увидеть страну красиво и мягко: немного дороги, много воздуха, теплый прием и очень фотогеничные остановки.',
        highlights: [
            'Панорамный выезд к озеру и каньонам',
            'Ночь в аутентичной юрте с домашним ужином',
            'Конные прогулки и остановки для съемки',
            'Комфортный темп без тяжелых переходов'
        ],
        itinerary: [
            'День 1: выезд из Бишкека, видовые остановки и знакомство с маршрутом',
            'День 2: озеро, конная прогулка и вечер в юртовом лагере',
            'День 3: утренние панорамы и обратный путь через живописные локации'
        ],
        includes: [
            'Трансфер по маршруту',
            'Проживание 2 ночи',
            'Завтраки и один атмосферный ужин',
            'Локальный гид-сопровождающий'
        ],
        cta: 'Если хочется добавить больше озерного отдыха или сделать поездку романтичнее, этот пакет легко расширяется еще на 1–2 дня.'
    },
    'tian-shan': {
        eyebrow: 'Signature itinerary',
        title: 'Сердце Тянь-Шаня',
        intro: 'Главный маршрут для знакомства с контрастами Кыргызстана: озеро, хвойные ущелья, красные скалы и ночевки в местах, где комфорт сочетается с сильным ощущением пути.',
        price: '28 000 ₽',
        duration: '7 дней',
        style: 'Классический премиальный маршрут',
        image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Jeti-Oguz%20rocks%2C%20Issyk%20Kul%20region%2C%20Kyrgyzstan%2002.jpg',
        story: 'Это самый универсальный пакет: он подходит и для первого визита, и для пары, и для небольшой компании, которой нужен полноценный travel experience без ощущения спешки.',
        highlights: [
            'Иссык-Куль, Каракол и Джеты-Огуз в одном маршруте',
            'Премиальный внедорожный трансфер на сложных участках',
            'Комфортные размещения с красивыми видами',
            'Локальная кухня и культурные остановки по пути'
        ],
        itinerary: [
            'День 1: прибытие и знакомство с Бишкеком',
            'День 2: дорога к Иссык-Кулю и отдых у воды',
            'День 3: переезд в Каракол и прогулки по городу',
            'День 4: Джеты-Огуз и альпийские панорамы',
            'День 5: природные локации восточного берега',
            'День 6: возвращение через видовые точки маршрута',
            'День 7: свободное утро и выезд'
        ],
        includes: [
            'Все трансферы по программе',
            'Проживание 6 ночей',
            'Базовый экскурсионный блок',
            'Сопровождение координатора'
        ],
        cta: 'Этот тур хорошо кастомизируется: можно усилить озерную часть, добавить больше треккинга или превратить его в slow luxury маршрут.'
    },
    'sky': {
        eyebrow: 'Private luxury',
        title: 'Небо над вершинами',
        intro: 'Индивидуальный маршрут для тех, кто хочет максимума пространства, приватности и сильных горных сцен без компромиссов по сервису и эстетике поездки.',
        price: '75 000 ₽',
        duration: '10 дней',
        style: 'Private expedition luxury',
        image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ala%20archa.JPG',
        story: 'Это тур для тех, кому важны личный ритм, лучшие точки обзора и высокий уровень организации. Он ощущается как авторская экспедиция, собранная специально под одного гостя или пару.',
        highlights: [
            'Индивидуальная логистика и private guide',
            'Лучшие видовые размещения по маршруту',
            'Авторские гастро-остановки и приватные сцены',
            'Максимальная гибкость в темпе путешествия'
        ],
        itinerary: [
            'День 1–2: мягкое вхождение в маршрут и видовые city-to-mountain переходы',
            'День 3–5: ключевые природные сцены с фото-остановками и slow pace',
            'День 6–8: высокогорные участки и самые сильные панорамы поездки',
            'День 9–10: финальные акценты маршрута и спокойное возвращение'
        ],
        includes: [
            'Индивидуальный транспорт по всему маршруту',
            'Премиальные размещения',
            'Персональное сопровождение',
            'Гибкая настройка программы под ваши интересы'
        ],
        cta: 'Если вам нужен по-настоящему особенный маршрут, этот пакет можно доработать до формата anniversary trip, private photo journey или ultra-comfort mountain escape.'
    }
};

const renderTourPage = () => {
    const params = new URLSearchParams(window.location.search);
    const selectedTour = params.get('tour') || 'tian-shan';
    const tour = tourCatalog[selectedTour] || tourCatalog['tian-shan'];

    const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
    };

    setText('#tour_eyebrow', tour.eyebrow);
    setText('#tour_title', tour.title);
    setText('#tour_intro', tour.intro);
    setText('#tour_price', tour.price);
    setText('#tour_duration', tour.duration);
    setText('#tour_style', tour.style);
    setText('#tour_story_text', tour.story);
    setText('#tour_cta_text', tour.cta);

    const storyImage = document.querySelector('#tour_story_image');
    if (storyImage) {
        storyImage.src = tour.image;
        storyImage.alt = tour.title;
    }

    const heroBackdrop = document.querySelector('#tour_hero_backdrop');
    if (heroBackdrop) {
        heroBackdrop.style.backgroundImage = `url('${tour.image}')`;
    }

    const fillList = (selector, items) => {
        const container = document.querySelector(selector);
        if (!container) return;
        container.innerHTML = '';
        items.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            container.appendChild(li);
        });
    };

    fillList('#tour_highlights', tour.highlights);
    fillList('#tour_itinerary', tour.itinerary);
    fillList('#tour_includes', tour.includes);
};

window.addEventListener('DOMContentLoaded', renderTourPage);
