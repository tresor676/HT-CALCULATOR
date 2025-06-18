const display = document.getElementById('display');

let expression = '';

let radians = false; // false = degré par défaut

let ans = 0;

function updateDisplay() {

display.textContent = expression || '0';

}

function appendToExpression(value) {

expression += value;

updateDisplay();

}

function clearExpression() {

expression = '';

updateDisplay();

}

function toggleRadDeg() {

radians = !radians;

alert(`Mode ${radians ? 'radian' : 'degré'}`);

}

// Exemple simple d'écoute sur tous les boutons

document.querySelectorAll('button').forEach(btn => {

btn.addEventListener('click', () => {

const val = btn.textContent;

if(val === 'C') {

clearExpression();

return;

}

if(val === 'RAD/DEG') {

toggleRadDeg();

return;

}

if(val === '=') {

// Ici tu peux faire ton évaluation d'expression

try {

// Par simplicité, eval (attention à sécuriser !)

ans = eval(expression);

expression = ans.toString();

} catch(e) {

expression = 'Erreur';

}

updateDisplay();

return;
}

appendToExpression(val);

});

});

updateDisplay();
  
