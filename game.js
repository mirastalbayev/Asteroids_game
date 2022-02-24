var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var aster = [];
var fire = [];
var expl = [];
var timer = 0;
var ship = {
    x: 300,
    y: 300,
    animx: 0,
    animy: 0
};

// Загрузка ресурсов
var asterimg = new Image();
asterimg.src = "astero.png";

var fireimg = new Image();
fireimg.src = "fire.png";

var shipimg = new Image();
shipimg.src = "ship01.png";

var fonimg = new Image();
fonimg.src = "fon.png";

var explimg = new Image();
explimg.src = "expl222.png";

// Начальные установки???
canvas.addEventListener("mousemove", function(event) {
    ship.x = event.offsetX-25;
    ship.y = event.offsetY-13;
});

// Старт игры
explimg.onload = function() {
    game();
}

// Основной игровой цикл
function game() {
    update();
    render();
    requestAnimFrame(game);
}

// Функция обновления состояния игры
function update() {
    timer++;
    
    //спавн(точка возрождения объектов) астероидов
    if (timer % 10 == 0) {
        aster.push({
            x: Math.random() * 600,
            y: -50,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 + 2,
            del: 0
        });
    }

    // Выстрел
    if (timer % 30 == 0) {
        fire.push({
            x: ship.x + 10,
            y: ship.y,
            dx: 0,
            dy: -5.2
        });

        fire.push({
            x: ship.x + 10,
            y: ship.y,
            dx: 0.5,
            dy: -5
        });

        fire.push({
            x: ship.x + 10,
            y: ship.y,
            dx: -0.5,
            dy: -5
        });
    }

    // Двигаем пули
    for (i in fire) {
        fire[i].x = fire[i].x + fire[i].dx;
        fire[i].y = fire[i].y + fire[i].dy;

        if (fire[i].y < -30) fire.splice(i, 1);
    }

    // Анимация взрывов
    for (i in expl) {
        expl[i].animx = expl[i].animx + 0.5;
        if (expl[i].animx > 7) {expl[i].animy++; expl[i].animx = 0}
        if (expl[i].animy > 7)
        expl.splice(i, 1);
    }

    // Физика
    for (i in aster) {
     aster[i].x = aster[i].x + aster[i].dx;
     aster[i].y = aster[i].y + aster[i].dy;

     // Граничные условия (коллайдер со стенками)
     if (aster[i].x >= 550 || aster[i].x < 0) aster[i].dx = -aster[i].dx;
     if (aster[i].y >= 600) aster.splice(i, 1);

      // Проверим каждый астероид на столкновение с каждой пулей
      for (j in fire) {
        
        // Произошло столкновение
        if (Math.abs(aster[i].x + 25 - fire[j].x - 15) < 50
        && Math.abs(aster[i].y - fire[j].y) < 25) {
            
            // Спавн взрыва
            expl.push({
                x: aster[i].x - 25,
                y: aster[i].y - 25,
                animx: 0,
                animy: 0
            });
            
            // Помечаем астероид на удаление
            aster[i].del = 1;
            fire.splice(j, 1);
            break;
          }
      }
      
      // Удаляем астероиды
      if(aster[i].del == 1) aster.splice(i, 1);
    }
}

function render() {
    
    // Рисуем фон
    context.drawImage(fonimg, 0, 0, 600, 600);
    
    // Рисуем корабль
    context.drawImage(shipimg, ship.x, ship.y);
    
    // Рисуем пули
    for (i in fire) context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
    
    // Рисуем астероиды
    for (i in aster) context.drawImage(asterimg, aster[i].x, aster[i].y, 50, 50);

    // Вращение астероидов
    
    context.save();
    context.translate(aster[i].x + 25, aster[i].y + 25);
    context.rotate(aster[i].angle);
    context.drawImage(asterimg, -25, -25, 50, 50);
    context.restore();
    //context.beginPath();
    //context.lineWidth = "2";
    //context.strokeStyle = "green";
    //context.rect(aster[i].x, aster[i].y, 50, 50);
    //context.stroke();
}

    // Рисуем взрывы
    for (i in expl) context.drawImage(explimg, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);

// Совместимость с браузерами
var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
               window.setTimeout(callback, 1000 / 20);
           };
})();

