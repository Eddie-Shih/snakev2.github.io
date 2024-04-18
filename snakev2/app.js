const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
//getContext() method會回傳一個canvas的drawing context
//drawing context可以用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit; //320 /20 = 16
const column = canvas.width / unit; //320 / 20 = 16

let snake = []; // array中的每個元素都是一個物件,物件功能為儲存身體x,y座標
function createSnake() {
  //物件的工作是儲存身體x,y座標
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

//製作果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  //果實被吃後隨機生成另一位置
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
//初始設定
createSnake();
let myFruit = new Fruit();
//方向控制
//觸碰按鍵設定
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// 為每個按鈕添加點擊事件監聽器
upButton.addEventListener("click", () => changeDirection("upButton"));
downButton.addEventListener("click", () => changeDirection("downButton"));
leftButton.addEventListener("click", () => changeDirection("leftButton"));
rightButton.addEventListener("click", () => changeDirection("rightButton"));
window.addEventListener("keydown", function (event) {
  event.preventDefault(); //預防頁面移動
  changeDirection(event.key);
});
let d = "Right"; //d代表方向direction

function changeDirection(key) {
  if ((key === "ArrowRight" || key === "rightButton") && d != "Left") {
    d = "Right";
    console.log("你正在按向右鍵 →");
  } else if ((key === "ArrowDown" || key === "downButton") && d != "Up") {
    d = "Down";
    console.log("你正在按向下鍵 ↓");
  } else if ((key === "ArrowLeft" || key == "leftButton") && d != "Right") {
    d = "Left";
    console.log("你正在按向左鍵 ←");
  } else if ((key === "ArrowUp" || key === "upButton") && d != "Down") {
    d = "Up";
    console.log("你正在按向上鍵  ↑");
  }
}

// document.getElementById("down-btn").addEventListener("click", function () {
//   if (d != "Up") {
//     d = "Down";
//   }
// });

// document.getElementById("left-btn").addEventListener("click", function () {
//   if (d != "Right") {
//     d = "Left";
//   }
// });

// document.getElementById("right-btn").addEventListener("click", function () {
//   if (d != "Left") {
//     d = "Right";
//   }
// });

let TopScore;
loadTopScore();
let score = 0;
document.getElementById("myScore").innerHTML = "You Score:" + score;
document.getElementById("myScore2").innerHTML = "Top Score:" + TopScore;

function draw() {
  //每次畫蛇前確認有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  //背景重置為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   console.log("正在執行draw,,,,");

  myFruit.drawFruit();

  //持續畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    //設定穿牆功能
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // //無法穿牆版本
    // if (snake[i].x >= canvas.width) {
    //   snake[i].x = canvas.width - unit * 3;
    // }
    // if (snake[i].x < 0) {
    //   snake[i].x = 0 + unit;
    // }
    // if (snake[i].y >= canvas.height) {
    //   snake[i].y = canvas.height - unit * 3;
    // }
    // if (snake[i].y < 0) {
    //   snake[i].y = 0 + unit;
    // }

    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前的d變數方向,來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x; // snake[o]是一個物件,但snake[0].x是個number
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score++;
    setTopscore(score);
    document.getElementById("myScore").innerHTML = "YourScore:" + score;
    document.getElementById("myScore2").innerHTML = "Top Score:" + TopScore;
    console.log("吃到果實了！");
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadTopScore() {
  if (localStorage.getItem("TopScore") == null) {
    TopScore = 0;
  } else {
    TopScore = Number(localStorage.getItem("TopScore"));
  }
}
function setTopscore(score) {
  if (score > TopScore) {
    localStorage.setItem("TopScore", score);
    TopScore = score;
  }
}
