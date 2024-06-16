const sudokuGrid = document.getElementById('sudoku-grid');
const resetBtn = document.getElementById('reset-btn');
const solveBtn = document.getElementById('solve-btn');
// const message = document.getElementById('message');

function createGrid() {
    sudokuGrid.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.contentEditable = true;
        cell.setAttribute('data-index', i);
        sudokuGrid.appendChild(cell);
    }
}

function fillGrid(grid) {
    const cells = sudokuGrid.querySelectorAll('.cell');
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        cells[i].innerText = grid[row][col] === 0 ? '' : grid[row][col];
    }
}

function getGrid() {
    const grid = [];
    const cells = sudokuGrid.querySelectorAll('.cell');
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (!grid[row]) grid[row] = [];
        grid[row][col] = cells[i].innerText === '' ? 0 : parseInt(cells[i].innerText);
    }
    return grid;
}

function isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function solveSudoku(grid, row = 0, col = 0) {
    if (row === 9) return true;
    if (col === 9) return solveSudoku(grid, row + 1, 0);
    if (grid[row][col] !== 0) return solveSudoku(grid, row, col + 1);

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid, row, col + 1)) {
                return true;
            }
            grid[row][col] = 0;
        }
    }
    return false;
}

function generateRandomSudoku() {
    const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillRandomCells(emptyGrid, 20);  // Fill 20 cells randomly as a starting point
    return emptyGrid;
}

function fillRandomCells(grid, count) {
    while (count > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        const num = Math.floor(Math.random() * 9) + 1;
        if (grid[row][col] === 0 && isValid(grid, row, col, num)) {
            grid[row][col] = num;
            count--;
        }
    }
}

resetBtn.addEventListener('click', () => {
    const newSudoku = generateRandomSudoku();
    fillGrid(newSudoku);
    message.style.display = 'none';
});

solveBtn.addEventListener('click', () => {
    const grid = getGrid();
    let delay = 0;
    if (solveSudokuAnimated(grid, delay)) {
        message.style.display = 'none';
    } else {
        message.style.display = 'block';
    }
});

function solveSudokuAnimated(grid, delay, row = 0, col = 0) {
    if (row === 9) return true;
    if (col === 9) return solveSudokuAnimated(grid, delay, row + 1, 0);
    if (grid[row][col] !== 0) return solveSudokuAnimated(grid, delay, row, col + 1);

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            setTimeout((() => {
                updateCell(row, col, num);
            }), delay);
        delay += 100;

        if (solveSudokuAnimated(grid, delay, row, col + 1)) {
            return true;
        }

        setTimeout(() => {
            updateCell(row, col, 0);
        }, delay);
        delay += 100;

        grid[row][col] = 0;
    }
}
return false;
}

function updateCell(row, col, num) {
const cell = sudokuGrid.children[row * 9 + col];
cell.classList.add('animated');
cell.innerText = num === 0 ? '' : num;
setTimeout(() => cell.classList.remove('animated'), 300);
}

createGrid();
