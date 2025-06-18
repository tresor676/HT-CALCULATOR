const display = document.getElementById('display');
const modeToggle = document.getElementById('modeToggle');

const basicScreen = document.getElementById('basicScreen');
const scientificScreen = document.getElementById('scientificScreen');

const angleToggleBasic = document.getElementById('angleToggle');
const angleToggleSci = document.getElementById('angleToggleSci');

let expression = '';
let angleMode = 'DEG'; // ou RAD

// Mise à jour affichage
function updateDisplay() {
  display.textContent = expression || '0';
}

// Ajout des événements sur tous les boutons (de base et scientifique)
function addListenersToButtons(container) {
  container.querySelectorAll('button.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.textContent;

      switch (val) {
        case 'C':
          expression = '';
          break;

        case '=':
          try {
            // Remplacer √( par sqrt(
            let expr = expression.replace(/√\(/g, 'sqrt(');
            // math.js comprend directement sin(), cos(), tan(), ln(), log(), exp(), ^

            // Gestion angles en radians ou degrés pour sin, cos, tan
            if (angleMode === 'DEG') {
              // On remplace sin(x) par sin(x deg en rad)
              expr = expr.replace(/(sin|cos|tan)\(([^()]+)\)/g, (match, fn, valInside) => {
                return `${fn}((${valInside}) * pi / 180)`;
              });
            }

            // Evaluer avec math.js
            let result = math.evaluate(expr);

            if (typeof result === 'number') {
              result = +result.toFixed(12);
            }

            expression = result.toString();
          } catch (e) {
            expression = 'Erreur';
            console.error(e);
          }
          break;

        case '±':
          // On change le signe du nombre le plus récent (ou expression vide)
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
}

// Initialisation listeners
addListenersToButtons(basicScreen);
addListenersToButtons(scientificScreen);

// Gestion bascule mode
modeToggle.addEventListener('click', () => {
  if (basicScreen.style.display !== 'none') {
    basicScreen.style.display = 'none';
    scientificScreen.style.display = 'grid';
    modeToggle.textContent = 'Retour en Mode Basique';
  } else {
    basicScreen.style.display = 'grid';
    scientificScreen.style.display = 'none';
    modeToggle.textContent = 'Passer en Mode Scientifique';
  }
  expression = '';
  updateDisplay();
});

// Gestion toggle DEG/RAD (basique)
angleToggleBasic.addEventListener('click', () => {
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  angleToggleBasic.textContent = angleMode;
  if(angleToggleSci) angleToggleSci.textContent = angleMode;
});

// Gestion toggle DEG/RAD (scientifique)
angleToggleSci.addEventListener('click', () => {
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  angleToggleSci.textContent = angleMode;
  if(angleToggleBasic) angleToggleBasic.textContent = angleMode;
});

updateDisplay();
