// Clase para representar un ítem del menú, aplicando el concepto de clases con propiedades y métodos.
class MenuItem {
    constructor(id, nombre, precio, tipo) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.tipo = tipo;
    }
    // Método para generar el HTML de un ítem, lo hace reutilizable y encapsula la vista.
    toHtml() {
        return `
            <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center seleccionar-item-btn" data-id="${this.id}" data-tipo="${this.tipo}">
                ${this.nombre} <span class="badge bg-primary rounded-pill">$${this.precio}</span>
            </button>`;
    }
};

// Variable que contiene el menu completo cuando se carga
let menuCompleto = [];

async function cargarMenu() {
    try {
        const response = await fetch('menu.json');

        if (!response.ok) {
            throw new Error('Error al cargar el menú: ' + response.statusText);
        }
        const data = await response.json();

        // Crear instancias de MenuItem y combinar los datos
        const platosPrincipales = data.platosPrincipalesData.map((item, index) => new MenuItem(index + 1, item.nombre, item.precio, "comida"));
        const bebidas = data.bebidasData.map((item, index) => new MenuItem(platosPrincipales.length + index + 1, item.nombre, item.precio, "bebida"));
        const postres = data.postresData.map((item, index) => new MenuItem(platosPrincipales.length + bebidas.length + index + 1, item.nombre, item.precio, "postre"));

        menuCompleto = [...platosPrincipales, ...bebidas, ...postres];

        renderizarMenu();

    } catch (error) {
        console.error('No se pudo cargar el menú:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    cargarEstadoDesdeStorage();
});

// -------------- LIBRERIAS -------------------------------------
function sweet() {
    Swal.fire({
        title: "Gracias por elegirnos!",
        text: "El chef esta preparando tu pedido 👨‍🍳",
        icon: "success",
        draggable: true
    });
};

function sweetError() {
    Swal.fire({
        icon: "error",
        title: "ADVERTENCIA!",
        text: "Debes seleccionar un plato principal, bebida y postre para confirmar el pedido.",
    });
};
// ----------------- APLICAR TESTIFY-----------------------------
const contenedoresDeMenu = document.querySelectorAll(".list-group");

// Itera sobre la lista de elementos y agrega el mismo 'event listener' a cada uno
contenedoresDeMenu.forEach(container => {
    container.addEventListener("click", () => {
        Toastify({
            text: "Agregado correctamente",
            duration: 2000,
            newWindow: true,
            stopOnFocus: true,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                width: "300px",
                "border-radius": "5px",
                "margin-top": "10px",
                "font-size": "20px",
                "text-align": "center",
            },
            onClick: function () { }
        }).showToast();
    });
});

document.getElementById("limpiarPedidoBtn").addEventListener("click", () => {
    Toastify({
        text: "Borraste tu pedido",
        duration: 1500,
        newWindow: true,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "red",
            width: "300px",
            "border-radius": "5px",
            "margin-top": "10px",
            "font-size": "20px",
        },
        onClick: function () { }
    }).showToast();
});
// -------------------------------------------------------

// Obtenemos todas las referencias a los elementos HTML con los que vamos a interactuar.
const nombreClienteSection = document.getElementById('nombreClienteSection');
const inputNombreCliente = document.getElementById('inputNombreCliente');
const guardarNombreBtn = document.getElementById('guardarNombreBtn');
const saludoCliente = document.getElementById('saludoCliente');

const menuSection = document.getElementById('menuSection');
const platosContainer = document.getElementById('platosContainer');
const bebidasContainer = document.getElementById('bebidasContainer');
const postresContainer = document.getElementById('postresContainer');
const verPedidoBtn = document.getElementById('verPedidoBtn');

const carritoSection = document.getElementById('carritoSection');
const resumenPedidoContainer = document.getElementById('resumenPedidoContainer');
const costoTotalDisplay = document.getElementById('costoTotalDisplay');
const confirmarPedidoBtn = document.getElementById('confirmarPedidoBtn');
const limpiarPedidoBtn = document.getElementById('limpiarPedidoBtn');
const volverMenuBtn = document.getElementById('volverMenuBtn');
const mensajeErrorCarrito = document.getElementById('mensajeErrorCarrito');

const confirmacionFinalSection = document.getElementById('confirmacionFinalSection');
const nombreClienteFinal = document.getElementById('nombreClienteFinal');
const nuevoPedidoBtn = document.getElementById('nuevoPedidoBtn');

// Estas variables mantendrán el estado de nuestro simulador.
let nombreUsuario = '';
// El pedido actual se almacena como un objeto con las categorías de los ítems.
let pedidoActual = {
    comida: null,
    bebida: null,
    postre: null
};

//  Guarda el pedido actual del cliente en localStorage.
function guardarPedidoEnStorage() {
    localStorage.setItem('pedidoActual', JSON.stringify(pedidoActual));
};

// Carga el pedido y el nombre del cliente desde localStorage al inicio.
function cargarEstadoDesdeStorage() {
    const pedidoGuardado = localStorage.getItem('pedidoActual');
    if (pedidoGuardado) {
        pedidoActual = JSON.parse(pedidoGuardado);
    }

    const nombreGuardado = localStorage.getItem('nombreCliente');
    if (nombreGuardado) {
        nombreUsuario = nombreGuardado;
        inputNombreCliente.value = nombreGuardado; // Rellenar el input si ya hay nombre
        mostrarSaludo(); // Mostrar saludo con nombre guardado
        mostrarSeccion(menuSection); // Pasar directamente a la sección del menú
    } else {
        mostrarSeccion(nombreClienteSection); // Si no hay nombre, empezar por pedirlo
    }
    renderizarMenu(); // Siempre renderizar el menú al cargar, por si se queda en esa sección
    renderizarPedidoActual(); // Renderizar el pedido si había algo guardado
};

// Guarda el nombre del cliente en localStorage.
function guardarNombreEnStorage(nombre) {
    localStorage.setItem('nombreCliente', nombre);
};

// Oculta todas las secciones principales y luego muestra la sección especificada.
function mostrarSeccion(sectionElement) {
    // Ocultar todas las secciones primero
    nombreClienteSection.style.display = 'none';
    menuSection.style.display = 'none';
    carritoSection.style.display = 'none';
    confirmacionFinalSection.style.display = 'none';
    // Mostrar la sección deseada
    sectionElement.style.display = 'block';
};

// Muestra el saludo al cliente y el input de su nombre.
function mostrarSaludo() {
    if (nombreUsuario) {
        saludoCliente.textContent = `¡Hola, ${nombreUsuario}!`;
    } else {
        saludoCliente.textContent = '';
        inputNombreCliente.value = '';
    }
};

// Renderiza los ítems del menú en sus respectivos contenedores (platos, bebidas, postres).
function renderizarMenu() {
    // Limpiamos los contenedores antes de renderizar
    platosContainer.innerHTML = '';
    bebidasContainer.innerHTML = '';
    postresContainer.innerHTML = '';

    // Iteramos sobre el menú completo y renderizamos cada ítem en su lugar.
    // Esto asegura que el menú esté siempre actualizado.
    menuCompleto.forEach(item => {
        if (item.tipo === "comida") {
            platosContainer.innerHTML += item.toHtml();
        } else if (item.tipo === "bebida") {
            bebidasContainer.innerHTML += item.toHtml();
        } else if (item.tipo === "postre") {
            postresContainer.innerHTML += item.toHtml();
        }
    });

    // Aquí adjuntamos a cada botón ya que el número es limitado y se re-renderiza.
    document.querySelectorAll('.seleccionar-item-btn').forEach(button => {
        button.addEventListener('click', seleccionarItemHandler);
    });
};

// Renderiza el resumen del pedido actual en la sección del carrito.
// Actualiza los precios y el costo total.
function renderizarPedidoActual() {
    let resumenHTML = '';
    let costoTotal = 0;

    const itemsDelPedido = ['comida', 'bebida', 'postre'];
    let i = 0;

    while (i < itemsDelPedido.length) {
        const tipoItem = itemsDelPedido[i];
        const item = pedidoActual[tipoItem]; // Acceder al elemento del pedido (e.g., pedidoActual.comida)

        let nombreTipoItem = '';
        switch (tipoItem) {
            case 'comida':
                nombreTipoItem = 'Plato Principal';
                break;
            case 'bebida':
                nombreTipoItem = 'Bebida';
                break;
            case 'postre':
                nombreTipoItem = 'Postre';
                break;
        }

        if (item) {
            resumenHTML += `<p class="mb-1"><strong>${nombreTipoItem}:</strong> ${item.nombre} ($${item.precio})</p>`;
            costoTotal += item.precio;
        } else {
            resumenHTML += `<p class="text-muted mb-1"><strong>${nombreTipoItem}:</strong> No seleccionado</p>`;
        }
        i++;
    }

    resumenPedidoContainer.innerHTML = resumenHTML;
    costoTotalDisplay.textContent = costoTotal.toFixed(2);
};

// Valida el nombre y lo guarda en localStorage.
function handleGuardarNombre() {
    const nombre = inputNombreCliente.value.trim();
    if (nombre) {
        nombreUsuario = nombre;
        guardarNombreEnStorage(nombreUsuario);
        mostrarSaludo();
        mostrarSeccion(menuSection); // Después de guardar el nombre, ir al menú
    } else {
        // En lugar de alert, se podría mostrar un mensaje en el DOM
        console.warn("ADVERTENCIA: El nombre del cliente no puede estar vacío.");
        saludoCliente.textContent = "Por favor, ingresa un nombre válido.";
        saludoCliente.classList.remove('text-success');
        saludoCliente.classList.add('text-danger');
    }
};

// Maneja el evento de selección de un ítem del menú.
function seleccionarItemHandler(event) {
    const itemId = parseInt(event.target.dataset.id);
    const itemTipo = event.target.dataset.tipo;

    // Buscamos el ítem completo en nuestro array combinado `menuCompleto`.
    const itemSeleccionado = menuCompleto.find(item => item.id === itemId);

    if (itemSeleccionado) {
        // Asignamos el ítem seleccionado a la categoría correcta en `pedidoActual`.
        pedidoActual[itemTipo] = itemSeleccionado;
        guardarPedidoEnStorage(); // Guardamos el pedido actualizado en localStorage.
        renderizarPedidoActual(); // Actualizamos el resumen del pedido en el DOM.
        // console.warn(`DEBUG: Seleccionado: ${itemSeleccionado.nombre} (${itemSeleccionado.tipo})`);
    }
};

// Lleva al usuario a la sección del carrito.
function handleVerPedido() {
    mostrarSeccion(carritoSection);
    renderizarPedidoActual(); // Asegura que el resumen esté actualizado al entrar al carrito
    mensajeErrorCarrito.style.display = 'none'; // Ocultar cualquier mensaje de error previo
};

// Valida que todos los ítems obligatorios estén seleccionados.
function handleConfirmarPedido() {
    // Validación de un proceso COMPLETO.
    if (!pedidoActual.comida || !pedidoActual.bebida || !pedidoActual.postre) {
        sweetError();
        mensajeErrorCarrito.style.display = 'block'; // Mostrar mensaje de error en el DOM
        return;
    }

    mensajeErrorCarrito.style.display = sweet(); // Ocultar mensaje de error si la validación pasa

    // Actualiza el nombre final en la sección de confirmación
    nombreClienteFinal.textContent = nombreUsuario;
    mostrarSeccion(confirmacionFinalSection); // Llevar a la sección de confirmación final
};

// Reinicia el estado del pedido actual y lo limpia de localStorage.
function handleLimpiarPedido() {
    pedidoActual = { comida: null, bebida: null, postre: null }; // Resetear el pedido
    guardarPedidoEnStorage(); // Guardar el estado vacío en localStorage
    renderizarPedidoActual(); // Actualizar el resumen del pedido en el DOM
    mostrarSeccion(menuSection); // Volver al menú
};

function handleVolverMenu() {
    mostrarSeccion(menuSection);
    mensajeErrorCarrito.style.display = 'none'; // Ocultar cualquier mensaje de error
};

// Reinicia completamente la aplicación.
function handleNuevoPedido() {
    nombreUsuario = ''; // Resetear el nombre de usuario
    inputNombreCliente.value = ''; // Vaciar el input del nombre
    pedidoActual = { comida: null, bebida: null, postre: null }; // Resetear el pedido
    mostrarSaludo(); // Vaciar el saludo o mostrar el input para un nuevo nombre
    mostrarSeccion(nombreClienteSection); // Volver al inicio para un nuevo cliente
    renderizarPedidoActual(); // Limpiar el resumen visual del pedido
};

// Se ejecuta cuando el DOM está completamente cargado, asegurando que todos los elementos existan.
document.addEventListener('DOMContentLoaded', () => {
    cargarEstadoDesdeStorage(); // Intenta cargar un estado previo desde localStorage.
    // Los event listeners se añaden una sola vez al cargar la página.
    guardarNombreBtn.addEventListener('click', handleGuardarNombre);
    inputNombreCliente.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleGuardarNombre();
        }
    });
});


verPedidoBtn.addEventListener('click', handleVerPedido);
confirmarPedidoBtn.addEventListener('click', handleConfirmarPedido);
limpiarPedidoBtn.addEventListener('click', handleLimpiarPedido);
volverMenuBtn.addEventListener('click', handleVolverMenu);
nuevoPedidoBtn.addEventListener('click', handleNuevoPedido);