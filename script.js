// Cargar datos desde servidor y mostrar en tabla
async function cargarDatosDesdeServidor() {
    try {
        const res = await fetch('http://localhost:PUERTO/api/materiales'); // Cambia PUERTO al que uses en el reenvío
        if (!res.ok) throw new Error("Error cargando datos");

        const data = await res.json();

        const materiales = data.materiales;  // Aquí obtienes el array de materiales

        const tableBody = document.getElementById('materialTableBody');
        tableBody.innerHTML = ""; // Limpiar tabla

        materiales.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.tipo || ''}</td>
                <td>${item.tamano || ''}</td>
                <td>${item.cantidad || ''}</td>
                <td>${item.precio || ''}</td>
                <td>${item.imagen ? `<img src="${item.imagen}" alt="Imagen de material">` : 'No imagen'}</td>
                <td><button class="deleteBtn">Eliminar</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Mostrar otras tablas en consola (puedes adaptar esto para mostrar en otras secciones)
        console.log("Herramientas:", data.herramientas);
        console.log("Pagos:", data.pagos);
        console.log("Personal:", data.personal);
        console.log("Presupuestos:", data.presupuestos);

    } catch (error) {
        console.error(error);
        alert("Error al cargar los datos desde el servidor");
    }
}

// Guardar datos en localStorage
function saveToLocalStorage() {
    const tableBody = document.getElementById('materialTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    const data = rows.map(row => ({
        tipo: row.cells[0].textContent,
        tamano: row.cells[1].textContent,
        cantidad: row.cells[2].textContent,
        precio: row.cells[3].textContent,
        imagen: row.cells[4].querySelector('img') ? row.cells[4].querySelector('img').src : ''
    }));

    console.log("Datos a guardar en localStorage:", data);

    localStorage.setItem('materiales', JSON.stringify(data));
}

// Cargar datos desde localStorage (puedes usarlo para fallback o pruebas)
function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('materiales')) || [];
    const tableBody = document.getElementById('materialTableBody');

    tableBody.innerHTML = "";

    console.log("Datos cargados desde localStorage:", data);

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.tamano}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio}</td>
            <td>${item.imagen ? `<img src="${item.imagen}" alt="Imagen de material">` : 'No imagen'}</td>
            <td><button class="deleteBtn">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Inicializar búsqueda en la tabla
function initSearchFunctionality() {
    const searchBar = document.getElementById('searchBar');
    const tableBody = document.getElementById('materialTableBody');

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const materialType = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const size = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (materialType.includes(searchTerm) || size.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}

// Cuando la página carga, llama a cargar datos desde servidor y activa búsqueda
window.onload = function() {
    cargarDatosDesdeServidor();
    initSearchFunctionality();
};

// Formulario para agregar material
document.getElementById('materialForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const tamano = document.getElementById('tamano').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const imagenInput = document.getElementById('imagen');

    if (imagenInput.files.length === 0) {
        alert("Por favor, selecciona una imagen.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const imagen = reader.result;

        const tableBody = document.getElementById('materialTableBody');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${tipo}</td>
            <td>${tamano}</td>
            <td>${cantidad}</td>
            <td>${precio}</td>
            <td><img src="${imagen}" alt="Imagen de material"></td>
            <td><button class="deleteBtn">Eliminar</button></td>
        `;

        tableBody.appendChild(row);

        saveToLocalStorage();

        document.getElementById('materialForm').reset();
    };
    reader.readAsDataURL(imagenInput.files[0]);
});

// Eliminar fila y guardar cambios
document.getElementById('materialTableBody').addEventListener('click', function (e) {
    if (e.target.classList.contains('deleteBtn')) {
        e.target.closest('tr').remove();
        saveToLocalStorage();
    }
});
