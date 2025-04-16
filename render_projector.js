const table = document.getElementById('bingo-table');
const lastNumber = document.querySelector('#last-number p');
const quintoPriceElement = document.querySelector('#quinto');
const plenaPriceElement = document.querySelector('#plena');
const announcementElement = document.getElementById('announcement');

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
            lastNumber.textContent = td.textContent; // Actualitzar l'últim número
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
        if (isSelected) {
            lastNumber.textContent = cell.textContent;
        }
    }
});

// Escuchar el reinicio desde el proceso principal
window.electronAPI.onReset(() => {
    document.querySelectorAll('td').forEach(cell => {
        cell.classList.remove('selected');
    });
    lastNumber.textContent = "-";
    quintoPriceElement.textContent = "-";
    plenaPriceElement.textContent = "-";
});

window.electronAPI.onPriceUpdate((event, type, value) => {
    if (type === 'quinto') {
        quintoPriceElement.textContent = value;
    } else if (type === 'plena') {
        plenaPriceElement.textContent = value;
    }
});

window.electronAPI.onPriceUpdate((event, type, value) => {
    if (type === 'quinto') {
        quintoPriceElement.textContent = value;
    } else if (type === 'plena') {
        plenaPriceElement.textContent = value;
    }
});

// Escuchar el evento de anuncio
window.electronAPI.onAnnounce((event, type) => {
    if (type === 'quinto') {
        announcementElement.textContent = 'Han cantat quinto!';
    } else if (type === 'plena') {
        announcementElement.textContent = 'Han cantat plena!';
    }

    // Mostrar el texto y luego ocultarlo después de 5 segundos
    announcementElement.style.display = 'block';
    setTimeout(() => {
        announcementElement.style.display = 'none';
    }, 5000);
});