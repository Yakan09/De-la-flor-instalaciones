// Función para guardar datos en localStorage
function saveToLocalStorage() {
    const tableBody = document.getElementById('materialTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    // Obtener los datos de cada fila
    const data = rows.map(row => ({
        tipo: row.cells[0].textContent,
        tamano: row.cells[1].textContent,
        cantidad: row.cells[2].textContent,
        precio: row.cells[3].textContent,  // Guardamos el precio
        imagen: row.cells[4].querySelector('img') ? row.cells[4].querySelector('img').src : ''
    }));

    console.log("Datos a guardar en localStorage:", data);

    // Guardar los datos en localStorage
    localStorage.setItem('materiales', JSON.stringify(data));
}

// Cargar datos desde localStorage al cargar la página
function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('materiales')) || [];
    const tableBody = document.getElementById('materialTableBody');
    
    // Limpiar la tabla antes de cargar los nuevos datos
    tableBody.innerHTML = "";

    // Verificar si hay datos en localStorage
    console.log("Datos cargados desde localStorage:", data);

    // Cargar los materiales
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.tamano}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio}</td>  <!-- Mostrar precio -->
            <td>${item.imagen ? `<img src="${item.imagen}" alt="Imagen de material">` : 'No imagen'}</td>
            <td><button class="deleteBtn">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Llamar a la función para cargar los materiales cuando la página se cargue
window.onload = function() {
    loadFromLocalStorage();
};

// Agregar material al hacer submit
document.getElementById('materialForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const tamano = document.getElementById('tamano').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').value;

    // Crear la nueva fila de la tabla
    const tableBody = document.getElementById('materialTableBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${tipo}</td>
        <td>${tamano}</td>
        <td>${cantidad}</td>
        <td>${precio}</td>  <!-- Mostrar precio -->
        <td>${imagen ? `<img src="${imagen}" alt="Imagen de material">` : 'No imagen'}</td>
        <td><button class="deleteBtn">Eliminar</button></td>
    `;

    tableBody.appendChild(row);

    // Guardar los datos en localStorage
    saveToLocalStorage();

    // Limpiar formulario
    document.getElementById('materialForm').reset();
});

// Eliminar fila
document.getElementById('materialTableBody').addEventListener('click', function (e) {
    if (e.target.classList.contains('deleteBtn')) {
        e.target.closest('tr').remove();
        saveToLocalStorage();
    }
});
