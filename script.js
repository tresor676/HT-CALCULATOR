const baseScreen = document.querySelector('.base-screen');
const sciScreen = document.querySelector('.scientific-screen');
const btnToSci = document.getElementById('toScientific');
const btnToBase = document.getElementById('toBase');
const display = document.getElementById('display');

let expression = '';
let angleMode = 'DEG'; // Mode par défaut

function updateDisplay() {
  display.textContent = expression || '0';
}

// Gestion changement mode
btnToSci.addEventListener('click', () => {
  baseScreen.classList.add('hidden');
  sciScreen.classList.remove('hidden');
  btnToSci.classList.add('hidden');
  btnToBase.classList.remove('hidden');
  btnToSci.setAttribute('aria-pressed', 'true');
  btnToBase.setAttribute('aria-pressed', 'false');
});

btnToBase.addEventListener('click', () => {
  sciScreen.classList.add('hidden');
  baseScreen.classList.remove('hidden');
  btnToBase.classList.add('hidden');
  btnToSci.classList.remove('hidden');
  btnToSci.setAttribute('aria-pressed', 'false');
  btnToBase.setAttribute('aria-pressed', 'true');
});

// Gestion des boutons calculatrice
document.querySelectorAll('.base-screen button, .scientific-screen button').forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent;

    switch (val) {
      case 'C':
        expression = '';
        break;

      case '=':
        try {
          let expr = expression;

          expr = expr
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/\^/g, '**');

          if (angleMode === 'DEG') {
            expr = expr
              .replace(/sin\(([^)]+)\)/g, (m, p1) => `Math.sin((${p1})*Math.PI/180)`)
              .replace(/cos\(([^)]+)\)/g, (m, p1) => `Math.cos((${p1})*Math.PI/180)`)
              .replace(/tan\(([^)]+)\)/g, (m, p1) => `Math.tan((${p1})*Math.PI/180)`);
          } else {
            expr = expr
              .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
              .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
              .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)');
          }

          let result = eval(expr);

          if (typeof result === 'number') {
            result = +result.toFixed(12);
          }

          expression = result.toString();
        } catch {
          expression = 'Erreur';
        }
        break;

      case 'RAD/DEG':
        angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
        alert(`Mode changé en ${angleMode}`);
        break;

      case '±':
        if (expression.startsWith('-')) {
          expression = expression.slice(1);
        } else {
          expression = '-' + expression;
        }
        break;

      default:
        expression += val;
        break;
    }

    updateDisplay();
  });
});

updateDisplay();
