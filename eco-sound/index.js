const listAudio = {
    name: [ /* 'forest', */ 'solovey', 'drozd', 'zarynka', 'javoronok', 'slavka', ],
    src: [ /* './assets/audio/forest.mp3', */ './assets/audio/solovey.mp3', './assets/audio/drozd.mp3', './assets/audio/zarynka.mp3', './assets/audio/javoronok.mp3', './assets/audio/slavka.mp3', ],
}
const audio = new Audio();
const playBtn = document.querySelector('.main_button_play');
const navigationBtns = document.querySelector('.nav_ul');
const activeBtns = Array.from(document.querySelectorAll('.nav_ul_li_link'));
const background = document.querySelector('.main');
let link = './assets/audio/forest.mp3';
audio.src = link;
let isPlay = false;
let playNum = 0;

/* link highlight switching function when clicked, previous to and next*/

function toggleAudioImg() {
    activeBtns.forEach(item => item.classList.remove('active'));
    activeBtns[playNum].classList.add('active');
    background.style.backgroundImage = `url('./assets/img/${activeBtns[playNum].dataset.bird}.jpg')`;
}
/*Switch to next track function*/
function playNext() {
    if (playNum === listAudio.src.length - 1) {
        playNum = 0;
        toggleAudioImg();
    } else {

        playNum++;
        toggleAudioImg();
    }
    audio.src = listAudio.src[playNum];
    audio.play();
}
/* Switch to previous track function*/
function playPrev() {
    if (playNum === 0) {
        playNum = listAudio.src.length - 1;
        toggleAudioImg();
    } else {
        playNum--;
        toggleAudioImg();
    }
    audio.src = listAudio.src[playNum];
    audio.play();
}

/* Audio player */
function playAudio() {
    if (!isPlay) {
        isPlay = true;
        playBtn.classList.add('active');
        audio.play();
    } else {
        audio.pause();
        isPlay = false;
        playBtn.classList.remove('active');
    }
}

playBtn.addEventListener('click', playAudio);

/* Change audio and image file */

function changeAudio(event) {
    if (event.target.classList.contains('nav_ul_li_link')) {
        const value = event.target.dataset.bird;
        link = `./assets/audio/${value}.mp3`;
        background.style.backgroundImage = `url('./assets/img/${value}.jpg')`;
        playNum = listAudio.name.indexOf(`${value}`);
        if (isPlay === true) {

            audio.src = link;
            audio.play();
        } else {
            audio.currentTime = 0;
        }

    }
}
navigationBtns.addEventListener('click', changeAudio);


/* Highlight link for change audio file */

function changeClassActive(event) {
    activeBtns.forEach(item => {
        item.classList.remove('active');
    })
    event.target.classList.add('active');
}

navigationBtns.addEventListener('click', changeClassActive);

/* Switch audio push the button */

function switchPlayNext() {
    if (isPlay === true) {
        if (!activeBtns.map(item => { return item.classList.contains('active') }).includes(true)) { // проверка на активные ссылки в навигации, если их нет и играет музыка, то след прееключение будет с первой ссылки
            playNum = 0;
            toggleAudioImg();
            audio.src = listAudio.src[playNum];
            audio.play();
        } else {
            playNext()
        }
    } else {
        alert('Что бы преключать музыку надо ее включить');
    }
}

function switchPlayPrev() {
    if (isPlay === true) {
        playPrev()
    } else {
        alert('Что бы преключать музыку надо ее включить');
    }
}

document.querySelector('.main_button_left').addEventListener('click', switchPlayPrev)
document.querySelector('.main_button_right').addEventListener('click', switchPlayNext)

/* Automatic switching to next track */

audio.addEventListener('ended', () => {
    if (!activeBtns.map(item => { return item.classList.contains('active') }).includes(true)) { // проверка на активные ссылки в навигации, если их нет и играет музыка, то след прееключение будет с первой ссылки
        playNum = 0;
        toggleAudioImg();
        audio.src = listAudio.src[playNum];
        audio.play();
    } else {
        playNext()
    }
})

const timer = document.querySelector('.time')
audio.addEventListener(
    "loadeddata",
    () => {
        timer.querySelector('.length').textContent = showDial(
            audio.duration
        );
    },
    false
);

function showDial(sec) {
    let seconds = parseInt(sec);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
}

setInterval(() => {
    timer.querySelector('.current').textContent = showDial(
        audio.currentTime
    );
}, 500);