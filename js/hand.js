document.addEventListener("DOMContentLoaded", () => {
    const boardEl = document.getElementById("bingo-board");

    // 数字のリスト（1〜50）
    const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1);

    // シャッフル関数（Fisher–Yatesアルゴリズム）
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 24個をランダムに取り出す（中心以外）
    const shuffled = shuffle([...allNumbers]).slice(0, 24);

    // 5×5の盤面に変換
    const bingoBoard = [];
    let idx = 0;
    for (let row = 0; row < 5; row++) {
        const line = [];
        for (let col = 0; col < 5; col++) {
            if (row === 2 && col === 2) {
                line.push("A"); // 中心は固定
            } else {
                line.push(shuffled[idx++]);
            }
        }
        bingoBoard.push(line);
    }

    // DOMに表示
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            // 中央マスなら追加スタイル
            if (row === 2 && col === 2) {
                cell.classList.add("marked", "center-cell");
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = bingoBoard[row][col] === "A" ? "〇" : bingoBoard[row][col];
            if (bingoBoard[row][col] === 0) cell.classList.add("marked"); // 中央〇
            boardEl.appendChild(cell);
        }
    }

    window.bingoBoard = bingoBoard;
});


const inputEl = document.getElementById("number-input");
const submitBtn = document.getElementById("submit-number");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score-result");

let startTime = null;
let timerInterval = null;
let usedNumbers = new Set();

// タイマー開始
function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        timerEl.textContent = `⏱ 経過時間: ${elapsed.toFixed(2)} 秒`;
    }, 100);
}

// タイマー停止
function stopTimer() {
    clearInterval(timerInterval);
}

// マスを〇に変える（該当すれば）
function markNumber(num) {
    let matched = false;
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (bingoBoard[row][col] === num) {
            cell.textContent = "〇";
            cell.classList.add("marked");
            bingoBoard[row][col] = "A"; // 判定用に置き換え
            matched = true;
        }
    });

    return matched;
}

// ビンゴ判定
function countBingoLinesWithHighlight(board) {
  let count = 0;
  const drawSoundClear = document.getElementById("bingo-sound");
  drawSoundClear.currentTime = 0;
  drawSoundClear.play();
  // 横
  for (let i = 0; i < 5; i++) {
    if (board[i].every(cell => cell === "A")) {
      count++;
      highlightCells([[i, 0], [i, 1], [i, 2], [i, 3], [i, 4]]);
    }
  }

  // 縦
  for (let j = 0; j < 5; j++) {
    let col = [];
    for (let i = 0; i < 5; i++) col.push(board[i][j]);
    if (col.every(cell => cell === "A")) {
      count++;
      highlightCells([[0, j], [1, j], [2, j], [3, j], [4, j]]);
    }
  }

  // 左上→右下
  if ([0, 1, 2, 3, 4].every(i => board[i][i] === "A")) {
    count++;
    highlightCells([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]]);
  }

  // 右上→左下
  if ([0, 1, 2, 3, 4].every(i => board[i][4 - i] === "A")) {
    count++;
    highlightCells([[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]]);
  }

  return count;
}

function highlightCells(coords) {
  for (let [row, col] of coords) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      cell.classList.add("bingo-line");
    }
  }
}

// ボタン押下イベント
submitBtn.addEventListener("click", () => {
    const num = parseInt(inputEl.value);
    if (isNaN(num) || num < 1 || num > 50) {
        alert("1〜50の数字を入力してください");
        return;
    }
    if (usedNumbers.has(num)) {
        alert("この数字はすでに入力済みです");
        return;
    }

    // 最初の入力でタイマー開始
    if (startTime === null) startTimer();

    usedNumbers.add(num);
    const matched = markNumber(num);

    if (matched) {
        const bingoCount = countBingoLinesWithHighlight(bingoBoard);

        document.getElementById('bingoCounter').textContent = bingoCount;

        if (bingoCount >= 3) {
            stopTimer();
            const bingoClear = document.getElementById("bingo-clear-sound");
            bingoClear.currentTime = 0;
            bingoClear.play();
            const elapsed = (performance.now() - startTime) / 1000;
            scoreEl.innerHTML = `🎉 クリア！スコア: <strong>${elapsed.toFixed(2)}</strong> 秒`;
            let btn = document.createElement("button");
            btn.addEventListener("click",function(){
                location.replace("front.html");
            },false);
            btn.innerHTML = "タイトル画面に戻る";
            let target = document.getElementById('backButton');
            target.appendChild(btn);
            }

        }
    inputEl.value = "";
});
