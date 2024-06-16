// script.js

document.addEventListener('DOMContentLoaded', () => {
    const problemTypeSelect = document.getElementById('problem-type');
    const knapsackInputs = document.getElementById('knapsack-inputs');
    const lcsInputs = document.getElementById('lcs-inputs');
    const matrixChainInputs = document.getElementById('matrix-chain-inputs');
    const solveButton = document.getElementById('solve-button');
    const visualization = document.getElementById('visualization');
    const explanation = document.getElementById('explanation');
    const speedInput = document.getElementById('speed');

    problemTypeSelect.addEventListener('change', (e) => {
        const selectedProblem = e.target.value;
        knapsackInputs.classList.add('hidden');
        lcsInputs.classList.add('hidden');
        matrixChainInputs.classList.add('hidden');
        if (selectedProblem === 'knapsack') {
            knapsackInputs.classList.remove('hidden');
        } else if (selectedProblem === 'lcs') {
            lcsInputs.classList.remove('hidden');
        } else if (selectedProblem === 'matrix-chain') {
            matrixChainInputs.classList.remove('hidden');
        }
    });

    solveButton.addEventListener('click', () => {
        const selectedProblem = problemTypeSelect.value;
        explanation.innerHTML = '';
        visualization.innerHTML = '';

        if (selectedProblem === 'knapsack') {
            solveKnapsack();
        } else if (selectedProblem === 'lcs') {
            solveLCS();
        } else if (selectedProblem === 'matrix-chain') {
            solveMatrixChain();
        }
    });

    function solveKnapsack() {
        const weights = document.getElementById('weights').value.split(',').map(Number);
        const values = document.getElementById('values').value.split(',').map(Number);
        const capacity = Number(document.getElementById('capacity').value);
        const n = weights.length;

        const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
        const steps = [];

        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    const includeItem = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                    const excludeItem = dp[i - 1][w];
                    dp[i][w] = Math.max(includeItem, excludeItem);
                    steps.push({ i, w, value: dp[i][w], includeItem, excludeItem });
                } else {
                    dp[i][w] = dp[i - 1][w];
                    steps.push({ i, w, value: dp[i][w] });
                }
            }
        }

        visualizeDP(dp, steps);
        displayExplanation(steps);
    }

    function solveLCS() {
        const seq1 = document.getElementById('seq1').value;
        const seq2 = document.getElementById('seq2').value;
        const m = seq1.length;
        const n = seq2.length;

        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        const steps = [];

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (seq1[i - 1] === seq2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
                steps.push({ i, j, value: dp[i][j] });
            }
        }

        visualizeDP(dp, steps);
        displayExplanation(steps);
    }

    function solveMatrixChain() {
        const dimensions = document.getElementById('dimensions').value.split(',').map(Number);
        const n = dimensions.length - 1;

        const dp = Array.from({ length: n }, () => Array(n).fill(0));
        const steps = [];

        for (let l = 2; l <= n; l++) {
            for (let i = 0; i < n - l + 1; i++) {
                const j = i + l - 1;
                dp[i][j] = Infinity;
                for (let k = i; k < j; k++) {
                    const q = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
                    if (q < dp[i][j]) {
                        dp[i][j] = q;
                    }
                    steps.push({ i, j, value: dp[i][j], q, i_k: dp[i][k], k_j: dp[k + 1][j] });
                }
            }
        }

        visualizeDP(dp, steps);
        displayExplanation(steps);
    }

    function visualizeDP(dp, steps) {
        const table = document.createElement('table');
        for (let i = 0; i < dp.length; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < dp[i].length; j++) {
                const cell = document.createElement('td');
                cell.textContent = dp[i][j];
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        visualization.appendChild(table);

        animateSteps(steps);
    }

    function animateSteps(steps) {
        let delay = parseInt(speedInput.value, 10); // Delay between each step in milliseconds
        steps.forEach((step, index) => {
            setTimeout(() => {
                const cell = document.getElementById(`cell-${step.i}-${step.j}`);
                cell.classList.add('highlight');
                cell.textContent = step.value;
                setTimeout(() => cell.classList.remove('highlight'), delay);

                if (step.includeItem !== undefined && step.excludeItem !== undefined) {
                    displayCurrentOperation(step.i, step.j, step.includeItem, step.excludeItem);
                } else if (step.q !== undefined && step.i_k !== undefined && step.k_j !== undefined) {
                    displayCurrentOperation(step.i, step.j, step.i_k, step.k_j, step.q);
                }
            }, index * delay);
        });
    }

    function displayCurrentOperation(i, j, value1, value2, finalValue = null) {
        const li = document.createElement('li');
        if (finalValue !== null) {
            li.textContent = `dp[${i}][${j}] = dp[${i}][k] + dp[k+1][${j}] + dimensions[i] * dimensions[k+1] * dimensions[j+1] => ${value1} + ${value2} = ${finalValue}`;
        } else {
            li.textContent = `dp[${i}][${j}] = max(${value1}, ${value2}) => ${finalValue || Math.max(value1, value2)}`;
        }
        explanation.appendChild(li);
    }

    function displayExplanation(steps) {
        steps.forEach(step => {
            const li = document.createElement('li');
            if (step.includeItem !== undefined && step.excludeItem !== undefined) {
                li.textContent = `dp[${step.i}][${step.w}] = max(dp[${step.i - 1}][${step.w - step.i}] + ${step.includeItem}, dp[${step.i - 1}][${step.w}]) = ${step.value}`;
            } else if (step.q !== undefined && step.i_k !== undefined && step.k_j !== undefined) {
                li.textContent = `dp[${step.i}][${step.j}] = min(dp[${step.i}][k] + dp[k+1][${step.j}] + dimensions[${step.i}] * dimensions[k+1] * dimensions[${step.j + 1}]) = ${step.value}`;
            } else {
                li.textContent = `dp[${step.i}][${step.w || step.j}] = ${step.value}`;
            }
            explanation.appendChild(li);
        });
    }
});
