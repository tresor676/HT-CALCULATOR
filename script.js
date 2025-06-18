  const baseScreen = document.querySelector('.base-screen');
  const sciScreen = document.querySelector('.scientific-screen');
  const btnToSci = document.getElementById('toScientific');
  const btnToBase = document.getElementById('toBase');
  const display = document.getElementById('display');

  console.log('btnToSci:', btnToSci);
  console.log('btnToBase:', btnToBase);

  btnToSci.addEventListener('click', () => {
    baseScreen.classList.add('hidden');
    sciScreen.classList.remove('hidden');
    btnToSci.classList.add('hidden');
    btnToBase.classList.remove('hidden');
  });

  btnToBase.addEventListener('click', () => {
    sciScreen.classList.add('hidden');
    baseScreen.classList.remove('hidden');
    btnToBase.classList.add('hidden');
    btnToSci.classList.remove('hidden');
  });

  let expression = '';
  let angleMode = 'DEG'; // par défaut

  function updateDisplay() {
    display.textContent = expression || '0';
  }

  document.querySelectorAll('.screen button').forEach(button => {
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

            // Gestion angles en radians/degrés pour sin, cos, tan
            if (angleMode === 'DEG') {
              expr = expr
                .replace(/sin\(([^)]+)\)/g, (match, p1) => `Math.sin((${p1})*Math.PI/180)`)
                .replace(/cos\(([^)]+)\)/g, (match, p1) => `Math.cos((${p1})*Math.PI/180)`)
                .replace(/tan\(([^)]+)\)/g, (match, p1) => `Math.tan((${p1})*Math.PI/180)`);
            } else {
              expr = expr
                .replace(/sin\(([^)]+)\)/g, `Math.sin($1)`)
                .replace(/cos\(([^)]+)\)/g, `Math.cos($1)`)
                .replace(/tan\(([^)]+)\)/g, `Math.tan($1)`);
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

  // Bloquer zoom multi-touch
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  // Bloquer double tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (e) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, false);
});
