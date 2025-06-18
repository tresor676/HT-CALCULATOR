let expression = '';
let angleMode = 'DEG';

const display = document.getElementById('expression');
const resultDisplay = document.getElementById('resultat');

function updateDisplay() {
  display.textContent = expression || '0';
}

function evaluateExpression() {
  try {
    let expr = expression;

    // Remplacer les symboles par du JS interprétable
    expr = expr.replace(/π/g, 'Math.PI');
    expr = expr.replace(/e/g, 'Math.E');
    expr = expr.replace(/√\(/g, 'Math.sqrt(');
    expr = expr.replace(/ln\(/g, 'Math.log(');
    expr = expr.replace(/log\(/g, 'Math.log10(');
    expr = expr.replace(/x²/g, '**2');
    expr = expr.replace(/xʸ/g, '**');

    // Gestion angle
    if (angleMode === 'DEG') {
      expr = expr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (_, fn, val) => {
        return `Math.${fn}((${val}) * Math.PI / 180)`;
      });
    } else {
      expr = expr.replace(/(sin|cos|tan)\(/g, (_, fn) => `Math.${fn}(`);
    }

    let result = Function(`"use strict"; return (${expr})`)();
    resultDisplay.textContent = '= ' + (Math.round(result * 1e12) / 1e12);
  } catch (e) {
    resultDisplay.textContent = '= Erreur';
  }
}

function handleInput(value) {
  if (value === 'C') {
    expression = '';
    resultDisplay.textContent = '= 0';
  } else if (value === '←') {
    expression = expression.slice(0, -1);
  } else if (value === '=') {
    evaluateExpression();
    return;
  } else if (value === '^2') {
    expression += 'x²';
  } else if (value === '^') {
    expression += 'xʸ';
  } else {
    expression += value;
  }
  updateDisplay();
}

document.querySelectorAll('button[data-fn]').forEach(button => {
  button.addEventListener('click', () => {
    const val = button.getAttribute('data-fn');
    handleInput(val);
  });
});

document.getElementById('angle-mode').addEventListener('click', () => {
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  document.getElementById('angle-mode').textContent = angleMode;
  updateDisplay();
});
