document.getElementById('conversionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    const result = convertUnits(fromUnit, toUnit, amount);

    document.getElementById('result').innerHTML = `<p>${amount} ${fromUnit} es igual a ${result} ${toUnit}.</p>`;
});

// Función para convertir entre unidades
function convertUnits(fromUnit, toUnit, amount) {
    let conversionRate = 1;

    // Kilogramos a Toneladas
    if (fromUnit === "kg" && toUnit === "ton") {
        conversionRate = 0.001;
    }
    // Toneladas a Kilogramos
    else if (fromUnit === "ton" && toUnit === "kg") {
        conversionRate = 1000;
    }
    // Metros Cúbicos a Metros Lineales
    else if (fromUnit === "m3" && toUnit === "m") {
        conversionRate = 1000;  // Asumimos una relación arbitraria para este ejemplo
    }
    // Metros Lineales a Metros Cúbicos
    else if (fromUnit === "m" && toUnit === "m3") {
        conversionRate = 0.001; // Relación inversa
    }

    return amount * conversionRate;
}
