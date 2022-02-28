import i18Obj from './translate.js'

let lang = 'en';

function themeChange() {
    const body = document.querySelector('.body');
    if (body.classList.contains('light')) {
        return 'light'
    } else {
        return 'dark';
    }

}
let theme = themeChange();


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
        const value = event.target.dataset.season
        portfolioImages.forEach((img, index) => img.src = `./assets/img/${value}/${index + 1}.jpg`)
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

const switchTheme = () => {
    const sunBtn = document.querySelector('.wrapper_icon-sun');
    const allСhangeElm = document.querySelectorAll('.body, .main, .section_title, .wrapper_section_title_skills, .wrapper_section_title, .section_skills_item__title, .section_skills_item__text, .section_buttons_portfolio, .wrapper_section_title_bg_portfolio, .section_price_card__title, .section_price_card_text');
    sunBtn.addEventListener('click', function() {
        allСhangeElm.forEach(item => {
            item.classList.toggle('light');
        })
    });
}
switchTheme()


/* Переключение язык оформления */



const langRu = document.querySelector('.change-lang-ru');
const langEn = document.querySelector('.change-lang-en');

function getTranslateRu() {
    lang = 'ru';
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
        switchTheme();
    }
}
window.addEventListener('load', getLocalStorage)

console.log('Ваша отметка - 77.5 балла(ов)\nОтзыв по пунктам ТЗ: \n Не выполненные / не засчитанные пункты: \n 1. сложные эффекты для кнопок при наведении и  клике \n Частично выполненные пункты: \n 1. выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы— 2.5 балла\n Все оставшиеся пункты выполнены и не имеют комментариев проверяющего.\n ')