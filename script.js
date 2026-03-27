const puzzles = [
    [
        "--74916-5",
        "2---6-3-9",
        "-----7-1-",
        "-586----4",
        "--3----9-",
        "--62--187",
        "9-4-7---2",
        "67-83----",
        "81--45---"
    ],
    [
        "53--7----",
        "6--195---",
        "-98----6-",
        "8---6---3",
        "4--8-3--1",
        "7---2---6",
        "-6----28-",
        "---419--5",
        "----8--79"
    ]
];

const solutions = [
    [
        "387491625",
        "241568379",
        "569327418",
        "758619234",
        "123784596",
        "496253187",
        "934176852",
        "675832941",
        "812945763"
    ],
    [
        "534672981",
        "672195348",
        "198345627",
        "859761423",
        "426853791",
        "713929856",
        "961537284",
        "287419635",
        "345286179"
    ]
];

let currentPuzzle = null;
let errors = 0;
let numSelected = null;
let tiles = [];

function getRandomPuzzleIndex(excludeIndex = null) {
    if (puzzles.length === 0) return null;
    if (puzzles.length === 1) return 0;

    let idx;
    do {
        idx = Math.floor(Math.random() * puzzles.length);
    } while (idx === excludeIndex);

    return idx;
}

function init() {
    if (currentPuzzle === null) {
        currentPuzzle = getRandomPuzzleIndex();
    }

    errors = 0;
    numSelected = null;
    tiles = [];
    document.getElementById('errorCount').textContent = '0';
    document.getElementById('winModal').classList.remove('show');
    setupTiles();
    setupButtons();
}

function setupTiles() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.row = r;
            tile.dataset.col = c;

            const char = puzzles[currentPuzzle][r][c];
            if (char !== '-') {
                tile.textContent = char;
                tile.classList.add('fixed');
            }

            tile.addEventListener('click', () => handleTileClick(r, c, tile));
            board.appendChild(tile);
            tiles.push({ element: tile, row: r, col: c, filled: char !== '-' });
        }
    }
}

function setupButtons() {
    const container = document.getElementById('numButtons');
    container.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = i;
        btn.addEventListener('click', () => selectNumber(btn, i));
        container.appendChild(btn);
    }
}

function selectNumber(btn, num) {
    if (numSelected) {
        numSelected.classList.remove('selected');
    }
    numSelected = btn;
    numSelected.classList.add('selected');
}

function handleTileClick(r, c, tile) {
    if (tile.classList.contains('fixed') || tile.textContent) {
        return;
    }

    if (!numSelected) {
        alert('먼저 숫자를 선택해주세요!');
        return;
    }

    const selectedNum = numSelected.textContent;
    const correct = solutions[currentPuzzle][r][c];

    if (selectedNum === correct) {
        tile.textContent = selectedNum;
        tile.classList.add('filled');
        checkWin();
    } else {
        errors++;
        document.getElementById('errorCount').textContent = errors;
        tile.classList.add('selected');
        setTimeout(() => {
            tile.classList.remove('selected');
        }, 300);
    }
}

function checkWin() {
    const allFilled = tiles.every(t => t.element.textContent !== '');
    const allCorrect = tiles.every(t => {
        if (t.element.textContent === '') return false;
        return t.element.textContent === solutions[currentPuzzle][t.row][t.col];
    });

    if (allFilled && allCorrect) {
        document.getElementById('winModal').classList.add('show');
    }
}

function resetGame() {
    currentPuzzle = getRandomPuzzleIndex(currentPuzzle);
    init();
}

function nextPuzzle() {
    const nextIndex = getRandomPuzzleIndex(currentPuzzle);
    currentPuzzle = nextIndex;
    init();
}

init();
