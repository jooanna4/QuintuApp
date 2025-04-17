const table = document.getElementById('bingo-table');
const resetButton = document.getElementById('reset-button');
const fullscreenButton = document.getElementById('fullscreen-button');
const quintoPriceInput = document.getElementById('quinto-price');
const plenaPriceInput = document.getElementById('plena-price');
const quintoBtn = document.getElementById('quinto-btn');
const plenaBtn = document.getElementById('plena-btn');

// Generar tabla de números
let number = 1;
for (let row = 0; row < 9; row++) {
    const tr = document.createElement('tr');
    for (let col = 0; col < 10; col++) {
        const td = document.createElement('td');
        td.textContent = number++;
        td.id = `cell-${number - 1}`;

        td.addEventListener('click', () => {
            td.classList.toggle('selected'); // Cambiar el color solo para esta celda
            window.electronAPI.cellClicked(td.id, td.classList.contains('selected')); // Informar al proceso principal
        });

        tr.appendChild(td);
    }
    table.appendChild(tr);
}

// Escuchar actualizaciones de sincronización
window.electronAPI.onCellUpdate((event, cellId, isSelected) => {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.classList.toggle('selected', isSelected);
    }
});

// Evento del botón de reinicio
resetButton.addEventListener('click', () => {
    // Quitar la clase "selected" de todas las celdas
    document.querySelectorAll('td').forEach(cell => {
        cell.classList.remove('selected');
    });

    quintoPriceInput.value = "";
    plenaPriceInput.value = "";

    // Informar al proceso principal para sincronizar el reinicio
    window.electronAPI.resetColors();
});

fullscreenButton.addEventListener('click', () => {
    const isFullscreen = fullscreenButton.textContent === 'Pantalla Completa';
    window.electronAPI.setFullscreen(isFullscreen);
    fullscreenButton.textContent = isFullscreen ? 'Sortir de la Pantalla Completa' : 'Pantalla Completa';
});

// Enviar el precio actualizado al proceso principal
quintoPriceInput.addEventListener('input', () => {
    window.electronAPI.updatePrice('quinto', quintoPriceInput.value);
});

plenaPriceInput.addEventListener('input', () => {
    window.electronAPI.updatePrice('plena', plenaPriceInput.value);
});

quintoBtn.addEventListener('click', () => {
    window.electronAPI.announce('quinto');
});

plenaBtn.addEventListener('click', () => {
    window.electronAPI.announce('plena');
});

// Genera números aleatoris

const randomButton = document.getElementById("random-number");

// Mantenim una llista de números ja marcats
let usedNumbers = new Set();

randomButton.addEventListener('click', () => {
    // Agafem tots els números que encara no s'han seleccionat
    const availableCells = Array.from(document.querySelectorAll('td')).filter(td => !td.classList.contains('selected'));

    if (availableCells.length === 0) {
        alert("Ja s'han cantat tots els números!");
        return;
    }

    // Escollim un número aleatori de la llista
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const selectedCell = availableCells[randomIndex];

    // Marquem la cel·la com si haguéssim fet clic
    selectedCell.classList.add('selected');

    // Avisem el procés principal
    window.electronAPI.cellClicked(selectedCell.id, true);
});
