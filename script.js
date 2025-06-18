// Éléments DOM
document.addEventListener('DOMContentLoaded', () => {
const baseScreen = document.querySelector('.base-screen');
const sciScreen = document.querySelector('.scientific-screen');
const btnToSci = document.getElementById('toScientific');
const btnToBase = document.getElementById('toBase');
const display = document.getElementById('display');

// Passage écran base -> scientifique
btnToSci.addEventListener('click', () => {
  baseScreen.classList.add('hidden');
  sciScreen.classList.remove('hidden');
  btnToSci.classList.add('hidden');
  btnToBase.classList.remove('hidden');
});

// Passage scientifique -> base
btnToBase.addEventListener('click', () => {
  sciScreen.classList.add('hidden');
  baseScreen.classList.remove('hidden');
  btnToBase.classList.add('hidden');
  btnToSci.classList.remove('hidden');
});

// Variables pour gestion calcul
let expression = '';
let angleMode = 'DEG'; // DEG par défaut

// Mise à jour afficheur
function updateDisplay() {
  display.textContent = expression || '0';
}

// Ajouter gestion clic sur tous les boutons (base + scientifique)
document.querySelectorAll('.screen button').forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent;

    switch(val) {
      case 'C':
        expression = '';
        break;
      case '=':
        try {
          // Ici tu peux intégrer ton moteur de calcul ou eval sécurisé
          // Pour démo, on fait eval simple (attention à sécuriser en vrai)
          let result = eval(expression.replace(/π/g, Math.PI).replace(/e/g, Math.E).replace(/\^/g, '**'));
          // Affichage arrondi si float long
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
        // Implémentation simple inversion signe
        if(expression.startsWith('-')) {
          expression = expression.slice(1);
        } else {
          expression = '-' + expression;
        }
        break;
      case 'sin(':
      case 'cos(':
      case 'tan(':
      case 'ln(':
      case 'log(':
      case '√(':
        expression += val;
        break;
      case 'π':
        expression += Math.PI.toFixed(6);
        break;
      case 'e':
        expression += Math.E.toFixed(6);
        break;
      case '!':
        expression += '!'; // Tu peux ajouter gestion factorielle plus tard
        break;
      default:
        expression += val;
        break;
    }
    updateDisplay();
  });
});

// Initialisation
updateDisplay();

// Bloquer zoom / double tap sur mobile
document.addEventListener('touchstart', function preventZoom(e) {
  if(e.touches.length > 1){
    e.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function preventDoubleTap(e) {
  let now = (new Date()).getTime();
  if(now - lastTouchEnd <= 300){
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);
