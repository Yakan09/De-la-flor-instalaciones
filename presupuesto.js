// Cargar materiales desde localStorage
function cargarMateriales() {
    const materiales = JSON.parse(localStorage.getItem('materiales')) || [];
    const materialList = document.getElementById('materialList');
    materialList.innerHTML = '';

    materiales.forEach((material, index) => {
        const div = document.createElement('div');
        div.classList.add('material');
        div.innerHTML = `
            <label>
                <input type="checkbox" id="material${index}" data-index="${index}" />
                ${material.tipo} - Cantidad: ${material.cantidad} - Precio por Kilo: €${material.precio}
                ${material.imagen ? `<img src="${material.imagen}" alt="${material.tipo}">` : ''}
                <input type="number" id="cantidadMaterial${index}" value="1" min="1" max="${material.cantidad}" />
            </label>
        `;
        materialList.appendChild(div);
    });
}

// Calcular presupuesto
function calcularPresupuesto() {
    const materiales = JSON.parse(localStorage.getItem('materiales')) || [];
    let total = 0;
    const manoDeObra = parseFloat(document.getElementById('manoDeObra').value) || 0;

    materiales.forEach((material, index) => {
        const checkbox = document.getElementById(`material${index}`);
        const cantidadSeleccionada = parseFloat(document.getElementById(`cantidadMaterial${index}`)?.value) || 0;

        if (checkbox && checkbox.checked) {
            const precio = parseFloat(material.precio);
            total += cantidadSeleccionada * precio;
        }
    });

    total += manoDeObra;
    document.getElementById('total').innerText = `€${total.toFixed(2)}`;
}

// Guardar presupuesto con nombre
function guardarPresupuesto() {
    const materiales = JSON.parse(localStorage.getItem('materiales')) || [];
    let presupuesto = { materiales: [], manoDeObra: 0, total: 0 };

    materiales.forEach((material, index) => {
        const checkbox = document.getElementById(`material${index}`);
        const cantidadSeleccionada = parseFloat(document.getElementById(`cantidadMaterial${index}`)?.value) || 0;

        if (checkbox && checkbox.checked) {
            const precio = parseFloat(material.precio);
            presupuesto.materiales.push({
                tipo: material.tipo,
                cantidad: cantidadSeleccionada,
                precio: precio.toFixed(2),
            });
            presupuesto.total += cantidadSeleccionada * precio;
        }
    });

    presupuesto.manoDeObra = parseFloat(document.getElementById('manoDeObra').value) || 0;
    presupuesto.total += presupuesto.manoDeObra;

    const nombrePresupuesto = prompt('Introduce un nombre para el presupuesto:');
    if (nombrePresupuesto) {
        presupuesto.nombre = nombrePresupuesto;
        const presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
        presupuestos.push(presupuesto);
        localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
        alert(`Presupuesto "${nombrePresupuesto}" guardado con éxito.`);
        mostrarPresupuestos();
    } else {
        alert('No se ha guardado el presupuesto.');
    }
}

// Mostrar presupuestos guardados
function mostrarPresupuestos() {
    const presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
    const contenedor = document.getElementById('presupuestosGuardados');
    contenedor.innerHTML = '';

    presupuestos.forEach((presupuesto) => {
        const div = document.createElement('div');
        div.classList.add('presupuesto');
        div.innerHTML = `
            <h3>${presupuesto.nombre}</h3>
            <ul>
                ${presupuesto.materiales.map(mat =>
            `<li>${mat.tipo} - Cantidad: ${mat.cantidad} - Precio: €${mat.precio}</li>`).join('')}
            </ul>
            <p>Mano de Obra: €${presupuesto.manoDeObra}</p>
            <p class="total">Total: €${presupuesto.total.toFixed(2)}</p>
        `;
        contenedor.appendChild(div);
    });
}

// Función auxiliar para convertir imagen a base64
function getBase64Image(imgElement) {
    const canvas = document.createElement("canvas");
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgElement, 0, 0);
    return canvas.toDataURL("image/jpeg");
}

async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth(); // ← ANCHO DE LA PÁGINA

    const logoImg = document.getElementById("logoEmpresa");
    let logoBase64 = null;
    if (logoImg && logoImg.complete) {
        logoBase64 = getBase64Image(logoImg);
    } else {
        await new Promise(resolve => {
            logoImg.onload = () => {
                logoBase64 = getBase64Image(logoImg);
                resolve();
            };
            logoImg.onerror = () => resolve();
        });
    }

    if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', 14, 10, 40, 20);
    }

    const fecha = new Date().toLocaleDateString();
    const presupuestoNum = "P" + Date.now().toString().slice(-6);
    const nombreCliente = prompt("Introduce el nombre de la clienta:", "Nombre 1Apellido 2Apellido");
    const direccionCliente = prompt("Introduce la dirección de la clienta:", "Cpostal, municipio, provincia, País");

    const cliente = `${nombreCliente}\n${direccionCliente}`;
    const emisor = "Dante Sánchez De la Flor\n48760716A\n03510 Callosa de ensarria, Alicante, España\nTelf. 617500720";

    let y = 10;
    doc.setFontSize(10);

    // EMISOR (alineado a la derecha)
    emisor.split("\n").forEach((line, i) => {
        doc.text(line, pageWidth - 14, y + i * 6, { align: "right" });
    });

    y += 30;
    doc.setFontSize(12);
    doc.line(14, y, 200, y);
    y += 8;

    // PRESUPUESTO info (alineado a la derecha)
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("PRESUPUESTO", pageWidth - 14, y, { align: "right" });
    doc.setFont(undefined, "normal");
    doc.text(`Nº de presupuesto ${presupuestoNum}`, pageWidth - 14, y + 6, { align: "right" });
    doc.text(`Fecha presupuesto ${fecha}`, pageWidth - 14, y + 12, { align: "right" });

    // CLIENTE (a la izquierda)
    doc.setFont(undefined, "bold");
    doc.text("CLIENTE", 14, y);
    doc.setFont(undefined, "normal");
    cliente.split("\n").forEach((line, i) => {
        doc.text(line, 14, y + 6 + i * 6);
    });

    y += Math.max(18, cliente.split("\n").length * 6) + 10;

    // … el resto del código continúa igual …


    doc.line(14, y, 200, y);
    y += 6;

    doc.setFontSize(9);
    doc.text("Descripción", 14, y);
    doc.text("Cant.", 80, y);
    doc.text("Precio uni.", 100, y);
    doc.text("Imp.", 130, y);
    doc.text("Total", 160, y);
    y += 4;
    doc.line(14, y, 200, y);
    y += 6;

    const materiales = JSON.parse(localStorage.getItem('materiales')) || [];
    const manoDeObra = parseFloat(document.getElementById('manoDeObra')?.value) || 0;
    let total = 0;

    for (let index = 0; index < materiales.length; index++) {
        const checkbox = document.getElementById(`material${index}`);
        const cantidad = parseFloat(document.getElementById(`cantidadMaterial${index}`)?.value) || 0;
        if (checkbox && checkbox.checked && cantidad > 0) {
            const mat = materiales[index];
            const precio = parseFloat(mat.precio);
            const subtotal = precio * cantidad;
            total += subtotal;

            doc.text(`${mat.tipo}`, 14, y);
            doc.text(`${cantidad}`, 80, y);
            doc.text(`${precio.toFixed(2)} €`, 100, y);
            doc.text("0%", 130, y);
            doc.text(`${subtotal.toFixed(2)} €`, 160, y);
            y += 6;

            if (y > 260) {
                doc.addPage();
                y = 20;
            }
        }
    }

    doc.text("Mano de Obra", 14, y);
    doc.text("1", 80, y);
    doc.text(`${manoDeObra.toFixed(2)} €`, 100, y);
    doc.text("0%", 130, y);
    doc.text(`${manoDeObra.toFixed(2)} €`, 160, y);
    total += manoDeObra;
    y += 6;

    if (y < 230) {
        y = 230;
    }

    doc.line(14, y, 200, y);
    y += 6;

    doc.setFont(undefined, "normal");
    doc.text("Base Imponible", 130, y);
    doc.text(`${total.toFixed(2)} €`, 160, y);

    y += 6;
    const iva = total * 0.21;
    doc.text("IVA 21%", 130, y);
    doc.text(`${iva.toFixed(2)} €`, 160, y);

    y += 6;
    doc.setLineWidth(0.3);
    doc.line(129, y, 185, y);
    y += 6;

    doc.setFont(undefined, "bold");
    doc.text("TOTAL", 130, y);
    doc.text(`${(total + iva).toFixed(2)} €`, 160, y);

    y += 10;
    doc.setFont(undefined, "normal");
    doc.text("Métodos de pago", 14, y);
    const metodoPago = prompt("Introduce el método de pago realizado:", "Pago en efectivo");
    doc.text(metodoPago || "No especificado", 14, y + 6);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`Presupuesto_${timestamp}.pdf`);
}

// Al cargar la página
window.onload = function () {
    cargarMateriales();
    mostrarPresupuestos();
};
