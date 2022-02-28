import i18Obj from './translate.js'

let lang = 'en';
const body = document.querySelector('.body');

function themeChange() {
    if (body.classList.contains('light')) {
        return 'light'
    } else {
        return 'dark';
    }

}
let theme;


/*  при нажатии на бугер иконку появляется крест */

const hamburger = document.querySelector('.hamburger');

function switchMenu() {
    hamburger.classList.toggle('open');
}
hamburger.addEventListener('click', switchMenu);

/* Добавляем меню при нажатии на бугер иконку */

const adaptiveMenu = document.querySelector('.nav');
const menuList = document.querySelectorAll('.nav-li_list');
const lineHumb = document.querySelectorAll('.line1, .line3');

function visibilityMenu() {
    if (document.querySelector('.body').classList.contains('light')) {
        adaptiveMenu.classList.toggle('light');
        lineHumb.forEach(item =>
            item.classList.toggle('light'));
        menuList.forEach(item =>
            item.classList.toggle('light'))
    }
    adaptiveMenu.classList.toggle('open');

}
hamburger.addEventListener('click', visibilityMenu);

/* Убираем меню при нажатии на ссылку */

const listMenu = document.querySelector('.ul-nav');

function closeMenu() {
    hamburger.classList.remove('open');
    adaptiveMenu.classList.remove('open');
}
listMenu.addEventListener('click', closeMenu);

/* Смена изображений в портфолио */

const portfolioBtns = document.querySelector('.section_buttons');
const portfolioImages = document.querySelectorAll('.section_img_item');

function changeImage(event) {
    if (event.target.classList.contains('section_buttons_portfolio')) {
        const value = event.target.dataset.season;
        portfolioImages.forEach((img, index) => img.src = `./assets/img/${value}/${index + 1}.jpg`);
        document.querySelectorAll('.section_buttons_portfolio').forEach((item) => item.classList.remove('active'));
        event.target.classList.add('active');
    }
}
portfolioBtns.addEventListener('click', changeImage);

/* Кэширование изображений */

const preloadImages = () => {
    const seasons = ['winter', 'spring', 'summer', 'autumn'];
    seasons.forEach(item => {
        for (let i = 1; i <= 6; i++) {
            const img = new Image();
            const folder = `./assets/img/${item}`;
            img.src = `${folder}/${i}.jpg`;
        }
    })
}
preloadImages()

/* Переключение светлой и тёмной темы */

const allСhangeElm = document.querySelectorAll('.body, .main, .section_title, .wrapper_section_title_skills, .wrapper_section_title, .section_skills_item__title, .section_skills_item__text, .section_buttons_portfolio, .wrapper_section_title_bg_portfolio, .section_price_card__title, .section_price_card_text');
const sunBtn = document.querySelector('.wrapper_icon-sun');
sunBtn.addEventListener('click', () => {
    if (body.classList.contains('light')) {
        allСhangeElm.forEach(item => {
            item.classList.remove('light');
        })
        theme = 'dark'
    } else {
        allСhangeElm.forEach(item => {
            item.classList.add('light');
        })
        theme = 'light'
    }
});

/* Переключение язык оформления */

const langRu = document.querySelector('.change-lang-ru');
const langEn = document.querySelector('.change-lang-en');

function getTranslateRu() {
    lang = 'ru';
    langRu.classList.add('active');
    langEn.classList.remove('active');
    const text = document.querySelectorAll('[data-lang]');
    text.forEach((item) => {
        const value = item.dataset.lang;
        if (item.placeholder) {
            item.placeholder = i18Obj.ru[value]
        } else {
            item.textContent = i18Obj.ru[value];
        }
    })
}

langRu.addEventListener('click', getTranslateRu);


function getTranslateEn() {
    lang = 'en';
    langEn.classList.add('active');
    langRu.classList.remove('active');
    const text = document.querySelectorAll('[data-lang]');
    text.forEach((item) => {
        const value = item.dataset.lang;
        if (item.placeholder) {
            item.placeholder = i18Obj.en[value]
        } else {
            item.textContent = i18Obj.en[value];
        }
    })
}

langEn.addEventListener('click', getTranslateEn);

/* Сохранение изменеий в Local storage */

function setLocalStorage() {
    localStorage.setItem('lang', lang);
    localStorage.setItem('theme', theme);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if (localStorage.getItem('lang') == 'ru') {
        getTranslateRu();
    }
    if (localStorage.getItem('theme') == 'light') {
        allСhangeElm.forEach(item => {
            item.classList.add('light');
        })
    }
}
window.addEventListener('load', getLocalStorage)