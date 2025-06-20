function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateBingoCard() {
  const numbers = shuffle([...Array(50)].map((_, i) => i + 1));
  const card = [];
  let index = 0;

  for (let row = 0; row < 5; row++) {
    const currentRow = [];
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        currentRow.push({ number: 0, marked: true }); // 中央FREE
      } else {
        currentRow.push({ number: numbers[index], marked: false });
        index++;
      }
    }
    card.push(currentRow);
  }

  return card;
}

// DOMに表示
function renderBingoCard(card) {
  const board = document.getElementById("bingo-board");
  board.innerHTML = "";

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (card[row][col].marked) {
        cell.textContent = "〇";
        cell.classList.add("center");
      } else {
        cell.textContent = card[row][col].number;
      }

      board.appendChild(cell);
    }
  }
}


let currentCard =[];
// ボタンで生成
document.getElementById("generate").addEventListener("click", () => {
  currentCard = generateBingoCard();
  renderBingoCard(currentCard);

   drawPool = shuffle([...Array(50)].map((_, i) => i + 1));
});

let drawPool= [];
let counter = 0;

document.getElementById('draw-number').addEventListener('click',()=>{
    if(drawPool.length === 0){
        alert('すべての数字を引きました。');
        return;
    }
    const number = drawPool.pop();
    document.getElementById("drawn-number").textContent = number;

    for(let i=0;i<5;i++){
        for(let j=0;j<5;j++){
            if(currentCard[i][j].number === number){
                currentCard[i][j].marked = true;
            }
        }
    }

    counter++;
    const drawSound = document.getElementById('draw-sound');
    drawSound.currentTime = 0;
    drawSound.play();
    const count = counter;
    document.getElementById('popCounter').textContent = count;

    renderBingoCard(currentCard);

    const bingoCount = checkBingoLines(currentCard);
    document.getElementById('bingoCounter').textContent = bingoCount;
    if(bingoCount >= 3){
        setTimeout(()=>{
        alert(`🎉 ゲームクリア！ Score: ${counter}`);
        counter = 0;
    },0);
    const drawSoundClear = document.getElementById("draw-sound-clear");
    drawSoundClear.currentTime = 0;
    drawSoundClear.play();
      let target = document.getElementById('backButton');

      // すでにボタンがあるか確認（class名やidで判定）
      if (!document.getElementById('back-to-title')) {
        let btn = document.createElement("button");
        btn.id = "back-to-title"; // 一意なIDを付ける
        btn.innerHTML = "タイトル画面に戻る";
        btn.addEventListener("click", function () {
          location.replace("front.html");
        }, false);

        target.appendChild(btn);
}
    }
});

function checkBingoLines(card) {
  let count = 0;

  // 横方向
  for (let i = 0; i < 5; i++) {
    if (card[i].every(cell => cell.marked)) count++;
  }

  // 縦方向
  for (let j = 0; j < 5; j++) {
    if ([0, 1, 2, 3, 4].every(i => card[i][j].marked)) count++;
  }

  // 斜め（左上→右下）
  if ([0, 1, 2, 3, 4].every(i => card[i][i].marked)) count++;

  // 斜め（右上→左下）
  if ([0, 1, 2, 3, 4].every(i => card[i][4 - i].marked)) count++;

  return count;
}
