const canvas = document.querySelector('.game');
const context = canvas.getContext('2d');
const textName = document.querySelector('.text_name');
const reset = document.querySelector('.reset')
const submit = document.querySelector('.submit');
const playButton = document.querySelector('.play-button');
const voice = document.querySelector('.voice');
const cont = document.querySelector('.total_result');
const btn = document.createElement('button');
const text = document.createElement('h2');
let audio = new Howl({
    src: ['./audio/sound.mp3'],
    loop: true,
});
let bonus = new Howl({
    src: ['./audio/bonus.mp3'],
});
bonus.rate(4)
let gameOver = new Howl({
    src: ['./audio/game_over.mp3'],
});



// Размер одной клеточки на поле — 16рх
let count = 0;
const grid = 16;
const snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4,
    level: 0
};
const apple = {
    x: 320,
    y: 320,
};
let appleImg = new Image();
appleImg.src = `img/1.png`;
let isPlayGame = false;
let isPlayMusic = false;
// количество набранных очков на старте 
let score = 0;
// рекорд игры 
let record = 0;
// текущий уровень сложности 
let level = 1;
// имя игрока с наибольшим рейтингом 
let recordName = '';
let gamerName = '';
//скорость движения змеи
let speed = 6;


//функция появления значка очистки поля ввода
function resetBtn(event) {
    event.preventDefault()
    textName.value = '';
    reset.style.display = 'none'
}
textName.addEventListener('input', () => {
    if (textName.value.length !== 0) {
        reset.style.display = 'block';
    }
    reset.addEventListener('click', (event) => {
        if (textName.value.length !== 0) {
            resetBtn(event)
        }
    })
})




// Функция ввода имени и запуска игры
function nameLoad() {
    gamerName = textName.value;
    localStorage.setItem('gamerName', gamerName);

}

// Узнаём размер хранилища и достаём оттуда значение рекорда и имя чемпиона  
let Storage_size = localStorage.length;
if (Storage_size > 0) {
    record = localStorage.getItem('record');
    recordName = localStorage.getItem('recordName');
}


// получаем доступ к холсту с игровой статистикой
const canvasScore = document.querySelector('.score');
const contextScore = canvasScore.getContext('2d');

//Делаем генератор случайных чисел в заданном диапазоне.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function showScore() {
    contextScore.clearRect(0, 0, canvasScore.width, canvasScore.height);
    contextScore.globalAlpha = 1;
    contextScore.fillStyle = 'orange';
    contextScore.font = '20px Courier New';
    contextScore.fillText('SNAKE', 120, 60);
    contextScore.fillText('Игрок:   ' + gamerName, 15, 100);
    contextScore.fillText('Уровень: ' + level, 15, 150);
    contextScore.fillText('Очков:   ' + score, 15, 200);
    contextScore.fillText('Чемпион: ' + recordName, 160, 150);
    contextScore.fillText('Рекорд:  ' + record, 160, 200);
};

//Игровой цикл - основной процесс, внутри которого будет все происходить
function loop() {
    //  функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
    requestAnimationFrame(loop);
    // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет. 
    if (++count < speed) {
        return;
    }
    //Обнуляем переменную скорости
    count = 0;
    //Очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Двигаем змейку с нужной скоростью
    snake.x += snake.dx;
    snake.y += snake.dy;
    // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    // Делаем тоже самое для движения по вертикали
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
    // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку.
    snake.cells.unshift({ x: snake.x, y: snake.y });
    // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно особождает клетки после себя
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    // Рисуем еду 
    context.drawImage(appleImg, apple.x, apple.y)
        // Одно движение змейки — один новый нарисованный квадратик
    context.fillStyle = 'green';
    // Обрабатываем каждый элемент змейки
    snake.cells.forEach(function(cell, index) {
        // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        // Если змейка добралась до яблока...
        if (cell.x === apple.x && cell.y === apple.y) {
            bonus.play()
                // увеличиваем длину змейки
            snake.maxCells++;
            //увеличивем счетчик
            score++;
            //увеличиваем скорость при набранных очках
            if (score == 10 || score == 20 || score == 30 || score == 40) {
                speed--;
                level++;
            };

            // Рисуем новую случайную пищу
            // размер холста 400x400, и он разбит на ячейки — 25 в каждую сторону
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
            appleImg.src = `img/${getRandomInt(1, 4)}.png`;
        }

        // Проверяем, не столкнулась ли змея сама с собой
        // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами
        for (let i = index + 1; i < snake.cells.length; i++) {

            // Если такие клетки есть — начинаем игру заново
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Задаём стартовые параметры основным переменным
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                let arrMembers = {};
                if (!localStorage.getItem('members')) {
                    arrMembers[gamerName] = score;
                    localStorage.setItem('members', JSON.stringify(arrMembers))

                } else {
                    let obj = JSON.parse(localStorage.getItem('members'))
                    obj[gamerName] = score;
                    localStorage.setItem('members', JSON.stringify(obj))

                }
                gameOver.play()
                alert('Lose, try again')
                    // Ставим еду в случайное место
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;

                // если игрок побил прошлый рекорд           
                if (score > record) {
                    // ставим его очки как рекорд
                    record = score;
                    // заносим в хранилище значение рекорда 
                    localStorage.setItem('record', `${record}`);
                    // меняем имя чемпиона 
                    recordName = gamerName;
                    // заносим в хранилище его имя 
                    localStorage.setItem('recordName', `${gamerName}`);
                };
                score = 0;
                level = 1;
                speed = 6;
            }
        }
    });
    // выводим статистику 
    showScore();
}

// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener('keydown', function(event) {
    // Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры. 
    // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
    if (event.key === 'ArrowLeft' && snake.dx === 0) {
        // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
        snake.dx = -grid;
        snake.dy = 0;
    } else if (event.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (event.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (event.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

//запуск игры при нажатии кнопки Enter в поле ввода имени игрока
textName.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && textName.value.length !== 0 && isPlayGame === false) {
        event.preventDefault()
        nameLoad()
        loop()
        playButton.textContent = 'Stop';
        isPlayGame = true;
        isPlayMusic = true;
        audio.play();
        voice.classList.add('mute');
        resetBtn(event)
            /* 
             */
    }
})

// Запускаем игру при нажатии кнопки play
playButton.addEventListener('click', () => {
    if (isPlayGame === false) {
        if (textName.value.length !== 0) {
            gamerName = textName.value;
            playButton.textContent = 'Stop';
            isPlayGame = true;
            isPlayMusic = true;
            nameLoad();
            loop();
            audio.play();
            voice.classList.add('mute');
            resetBtn(event)
        } else {
            alert("Для запуска игры введите имя")
        }
    } else {
        playButton.textContent = 'Play';
        isPlayGame = false;
        audio.pause();
        location.reload();
    }
});

// кнопка отключения звука 
voice.addEventListener('click', () => {

    if (isPlayMusic === true) {
        voice.classList.toggle('mute');
        audio.pause();
        isPlayMusic = false;
    } else {
        voice.classList.toggle('mute');
        audio.play();
        isPlayMusic = true;
    }
})

// вывод последних 10 участников и их счета

function total() {
    arrMembers = JSON.parse(localStorage.getItem('members'));
    for (let key in arrMembers) {
        const text = document.createElement('h2');
        text.classList.add('total_text');
        text.textContent = `${key}: ${arrMembers[key]}`;
        cont.append(text);
    }
    const record_text = document.createElement('h2');
    record_text.classList.add('record_text');
    record_text.textContent = `${localStorage.getItem('recordName')}: ${localStorage.getItem('record')} record`;
    btn.classList.add('remove_btn');
    btn.textContent = 'Reset';
    cont.append(record_text);
    cont.append(btn);
}
total()

//очистка поля списка игроков
btn.addEventListener('click', () => {
    localStorage.removeItem('members');
    document.querySelectorAll('.total_text').forEach(item => item.remove());
})

//открытие списка игроков и автоматическок закрытие через 3 сек
const members = document.querySelector('.members');
members.addEventListener('click', () => {
    cont.classList.toggle('active')
    setTimeout(() => cont.classList.remove('active'), 3000);

})