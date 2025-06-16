// Arma tu propio menu
const platoPrincipal = [
    { nombre: "Pasta", precio: 1500 },
    { nombre: "Risotto", precio: 1600 },
    { nombre: "Pollo al verdeo", precio: 1700 },
    { nombre: "Pizza", precio: 1200 },
    { nombre: "Hamburguesa", precio: 1800 },
    { nombre: "Nada", precio: 0 }
];
const bebidas = [
    { nombre: "Agua", precio: 300 },
    { nombre: "Gaseosa", precio: 400 },
    { nombre: "Limonada", precio: 350 },
    { nombre: "Cerveza", precio: 500 },
    { nombre: "Vino", precio: 800 },
    { nombre: "Nada", precio: 0 }
];
const postres = [
    { nombre: "Helado", precio: 300 },
    { nombre: "Ensalada de frutas", precio: 200 },
    { nombre: "Tarta", precio: 400 },
    { nombre: "Brownie", precio: 350 },
    { nombre: "Nada", precio: 0 }
];

function formatearListaParaPrompt(lista) {
    // Utiliza map para extraer solo los nombres
    return lista.map(item => `\n${item.nombre} ($${item.precio})`);
}
function calcularCostoTotal(plato, bebida, postre) {
    // Suma los precios de los objetos pasados como parámetros
    const total = plato.precio + bebida.precio + postre.precio;
    return total;
}
function buscarItemPorNombre(nombreBuscado, lista) {
    // Algoritmo con Ciclo (bucle for...of) para buscar un elemento en el array
    for (const item of lista) {
        if (item.nombre.toLowerCase() === nombreBuscado.toLowerCase()) {
            return item; // Retorna el objeto completo si encuentra una coincidencia
        }
    }
    return null; // Retorna null si no se encuentra el ítem
}
function solicitarPedido() {
    console.log("Iniciando Pedido de Restaurante");
    const nombreCliente = prompt("Bienvenido al restaurante. Por favor, ingrese su nombre:");
    if (nombreCliente === null || nombreCliente.trim() === "") {
        alert("Pedido cancelado. Necesitamos su nombre para continuar.");
        console.log("Pedido cancelado por el cliente (nombre no ingresado).");
        return;
    }
    console.log(`Hola, ${nombreCliente}!`);

    let platoSeleccionado = null;
    let bebidaSeleccionada = null;
    let postreSeleccionado = null;

    // Bucle para seleccionar el plato principal
    while (platoSeleccionado === null) {
        const inputPlato = prompt(`Selecciona tu plato principal: (${formatearListaParaPrompt(platoPrincipal)})`).toLowerCase();
        if (inputPlato === null) { // Si el usuario cancela
            alert("Pedido cancelado.");
            console.log("Pedido finalizado por el cliente (plato cancelado).");
            return;
        }
        platoSeleccionado = buscarItemPorNombre(inputPlato, platoPrincipal);
        if (platoSeleccionado === null) {
            alert("Plato no válido. Por favor, elige una opción de la lista.");
        }
    }
    console.log(`Plato principal: ${platoSeleccionado.nombre} ($${platoSeleccionado.precio})`);
    // Bucle para seleccionar la bebida
    while (bebidaSeleccionada === null) {
        const inputBebida = prompt(`Selecciona tu bebida: (${formatearListaParaPrompt(bebidas)})`).toLowerCase();
        if (inputBebida === null) { // Si el usuario cancela
            alert("Pedido cancelado.");
            console.log("Pedido finalizado por el cliente (bebida cancelada).");
            return;
        }
        bebidaSeleccionada = buscarItemPorNombre(inputBebida, bebidas);
        if (bebidaSeleccionada === null) {
            alert("Bebida no válida. Por favor, elige una opción de la lista.");
        }
    }
    console.log(`Bebida: ${bebidaSeleccionada.nombre} ($${bebidaSeleccionada.precio})`);
    // Bucle para seleccionar el postre
    while (postreSeleccionado === null) {
        const inputPostre = prompt(`Selecciona tu postre: (${formatearListaParaPrompt(postres)})`).toLowerCase();
        if (inputPostre === null) { // Si el usuario cancela
            alert("Pedido cancelado.");
            console.log("Pedido finalizado por el cliente (postre cancelado).");
            return;
        }
        postreSeleccionado = buscarItemPorNombre(inputPostre, postres);
        if (postreSeleccionado === null) {
            alert("Postre no válido. Por favor, elige una opción de la lista.");
        }
    }
    console.log(`Postre: ${postreSeleccionado.nombre} ($${postreSeleccionado.precio})`);
    // Llama a la función para calcular el costo total
    const costoTotal = calcularCostoTotal(platoSeleccionado, bebidaSeleccionada, postreSeleccionado);

    // Prepara el mensaje de resumen del pedido
    let resumenPedido = `
    --- Resumen de tu Pedido, ${nombreCliente}! ---

    Plato Principal: ${platoSeleccionado.nombre} ($${platoSeleccionado.precio})
    Bebida: ${bebidaSeleccionada.nombre} ($${bebidaSeleccionada.precio})
    Postre: ${postreSeleccionado.nombre} ($${postreSeleccionado.precio})

    Costo Total del Pedido: $${costoTotal}`;

    // Confirma el pedido con el usuario
    const confirmarPedido = confirm(resumenPedido + "\n¿Confirmas tu pedido?");

    // Algoritmo Condicional: Muestra mensaje final basado en la confirmación
    if (confirmarPedido) {
        alert("¡Pedido confirmado! Disfruta tu comida.");
        console.log(resumenPedido);
        console.log("¡Gracias por tu pedido!");
    } else {
        alert("Pedido cancelado. ¡Esperamos verte pronto!");
        console.log("Pedido cancelado por el cliente.");
    }
    console.log("--- Pedido de Restaurante Finalizado ---");
}

solicitarPedido();
