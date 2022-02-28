const url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f271ba71a98e3f07b38a726072f6f052&page=1';
const img = 'https://image.tmdb.org/t/p/w1280';
const searchMov =
    'https://api.themoviedb.org/3/search/movie?&api_key=f271ba71a98e3f07b38a726072f6f052&query=';

const main = document.querySelector('.main');
const form = document.querySelector('.search-container_form');
const search = document.querySelector('.input');

getData(url);

async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.length === 0) {
        const banner2 = document.createElement('p');
        banner2.textContent = 'Nothing found!!!!';
        main.append(banner2);
        banner2.style.color = 'white';
        banner2.style.fontSize = '40px';
    } else {
        data.results.forEach(item => {
            const cont = document.createElement('div')
            cont.classList.add('movie');
            const wrap = document.createElement('div');
            wrap.classList.add('wrapper');
            const image = document.createElement('img');
            image.classList.add('movie_img');
            const text = document.createElement('span');
            text.classList.add('title');
            const rating = document.createElement('span');
            rating.classList.add('rating');
            const description = document.createElement('p');
            description.classList.add('description');
            const titleText = document.createElement('p');
            titleText.classList.add('titletext');
            let rat = `${item.vote_average}`
            titleText.textContent = 'Overview:'
            rating.textContent = 'IMDb: ' + rat;
            text.textContent = `${item.title}`;
            if (item.poster_path !== null) {
                image.src = img + item.poster_path;
                cont.appendChild(image);
            } else {
                const ban = document.createElement('p');
                ban.classList.add('banner');
                ban.textContent = 'Poster don`t finded';
                cont.prepend(ban)
            }
            description.textContent = `${item.overview}`;
            cont.append(wrap);
            cont.append(description);
            description.prepend(titleText)
            wrap.append(text);
            wrap.append(rating)
            main.append(cont);

            function colorChange(rat) {
                if (rat <= 5) {
                    rating.classList.add('red');
                } else if (rat > 5 && rat < 8) {
                    rating.classList.add('yellow');
                } else if (rat >= 8) {
                    rating.classList.add('green');
                }
            }
            colorChange(rat)
        })

    }

    // Запрет отправки формы, если строка поиска пуста.
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        main.textContent = '';
        const searchData = search.value;
        if (searchData) {
            getData(searchMov + searchData);
        }
    });
    //Перезагрузка страницы при очистки строки поиска
    document.querySelector('.reset').addEventListener('click', () => {
        document.location.reload()
    })
}