// Función para obtener el mes actual
function obtenerMesActual() {
    const fecha = new Date();
    const opciones = { month: 'long' };
    return fecha.toLocaleDateString('es-ES', opciones); // Retorna el mes en español
}

// Función para manejar el formulario
document.getElementById('clienteForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir el envío del formulario

    const id = document.getElementById('clienteId').value || Date.now(); // Si hay ID, usarlo; si no, generar uno nuevo
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value;
    const fechaContrato = document.getElementById('fechaContrato').value; // Obtener la fecha de contrato
    const tiempoContrato = document.getElementById('tiempoContrato').value;
    const ajustesContrato = document.getElementById('ajustesContrato').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const expensas = parseFloat(document.getElementById('expensas').value);
    const impuesto = parseFloat(document.getElementById('impuesto').value); // Nuevo campo impuesto
    const administrador = document.getElementById('administrador').value; // Obtener el administrador seleccionado

    const mesActual = obtenerMesActual(); // Obtener el mes actual

    // Crear el cliente
    const cliente = {
        id,
        mes: mesActual,
        nombre,
        apellido,
        direccion,
        fechaContrato,   // Nueva fecha de contrato
        tiempoContrato,  // Tiempo de contrato en años
        ajustesContrato, // Ajustes cada cuántos meses
        monto,
        expensas,
        impuesto,        // Impuesto o servicio
        totalAPagar: monto + expensas + impuesto, // Sumar monto, expensas e impuesto
        pago: "No", // Inicialmente se establece en "No"
        administrador    // Guardar el administrador seleccionado
    };

    // Guardar o actualizar el cliente
    guardarOActualizarCliente(cliente);
    
    // Reiniciar el formulario
    document.getElementById('clienteForm').reset();
    document.getElementById('clienteId').value = ''; // Limpiar el campo ID
});

// Función para guardar o actualizar el cliente en localStorage
function guardarOActualizarCliente(cliente) {
    let clientes = cargarClientesDesdeStorage();

    // Verificar si el cliente ya existe (comprobar por ID)
    const clienteExistenteIndex = clientes.findIndex(c => c.id == cliente.id);

    if (clienteExistenteIndex > -1) {
        // Si el cliente existe, actualizarlo
        clientes[clienteExistenteIndex] = cliente;
    } else {
        // Si no existe, agregarlo
        clientes.push(cliente);
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));
    cargarClientes(); // Cargar clientes después de agregar o actualizar uno
}

// Cargar clientes desde localStorage
function cargarClientesDesdeStorage() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

// Función para cargar clientes en la tabla
function cargarClientes() {
    const clientes = cargarClientesDesdeStorage();
    const tbody = document.querySelector('#clientTable tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" style="text-align:center;">No hay clientes registrados.</td></tr>'; // Mensaje si no hay clientes
        return;
    }

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.mes}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.fechaContrato}</td> <!-- Mostrar la fecha del contrato -->
            <td>${cliente.tiempoContrato}</td>  <!-- Mostrar tiempo de contrato -->
            <td>${cliente.ajustesContrato}</td> <!-- Mostrar ajustes cada cuántos meses -->
            <td>${cliente.monto.toFixed(2)}</td>
            <td>${cliente.expensas.toFixed(2)}</td>
            <td>${cliente.impuesto.toFixed(2)}</td> <!-- Mostrar impuesto o servicio -->
            <td>${cliente.totalAPagar.toFixed(2)}</td>
            <td>
                <select onchange="actualizarPago(${cliente.id}, this.value)">
                    <option value="Sí" ${cliente.pago === 'Sí' ? 'selected' : ''}>Sí</option>
                    <option value="No" ${cliente.pago === 'No' ? 'selected' : ''}>No</option>
                </select>
            </td>
            <td>${cliente.administrador}</td> <!-- Mostrar el administrador -->
            <td>
                <button class="btn-edit" onclick="editarCliente(${cliente.id})">Editar</button>
                <button class="btn-delete" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                <button class="btn-pay" onclick="realizarPago(${cliente.id}, ${cliente.totalAPagar})">Pagar</button>
                <button class="btn-download" onclick="descargarTicket(${cliente.id})">Descargar Ticket</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para actualizar el estado de pago
function actualizarPago(id, pago) {
    const clientes = cargarClientesDesdeStorage(); // Cargar clientes desde localStorage
    const cliente = clientes.find(c => c.id == id); // Buscar el cliente por ID

    if (cliente) {
        cliente.pago = pago; // Actualizar el estado de pago
        localStorage.setItem('clientes', JSON.stringify(clientes)); // Guardar los cambios en localStorage
    }
}

// Agregar botones de resumen en el HTML (dentro del body)
const resumenContainer = document.createElement('div');
resumenContainer.innerHTML = `
    <button id="resumenLalo">Resumen Lalo</button>
    <button id="resumenFede">Resumen Fede</button>
`;
document.body.appendChild(resumenContainer);

// Función para calcular y mostrar los resúmenes
function calcularResumen(administrador) {
    const clientes = cargarClientesDesdeStorage();
    let totalPagos = 0;

    clientes.forEach(cliente => {
        if (cliente.administrador === administrador && cliente.pago === "Sí") {
            totalPagos += cliente.totalAPagar; // Sumar solo los que pagaron
        }
    });

    alert(`Total de pagos realizados para ${administrador}: $${totalPagos.toFixed(2)}`);
}

// Event listeners para los botones de resumen
document.getElementById('resumenLalo').addEventListener('click', () => calcularResumen("Lalo"));
document.getElementById('resumenFede').addEventListener('click', () => calcularResumen("Fede"));


// Función para editar cliente
function editarCliente(id) {
    const clientes = cargarClientesDesdeStorage();
    const cliente = clientes.find(c => c.id == id);
    if (cliente) {
        document.getElementById('clienteId').value = cliente.id; // Establecer el ID del cliente en el formulario
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('apellido').value = cliente.apellido;
        document.getElementById('direccion').value = cliente.direccion;
        document.getElementById('fechaContrato').value = cliente.fechaContrato; // Llenar la fecha del contrato
        document.getElementById('tiempoContrato').value = cliente.tiempoContrato;
        document.getElementById('ajustesContrato').value = cliente.ajustesContrato;
        document.getElementById('monto').value = cliente.monto;
        document.getElementById('expensas').value = cliente.expensas;
        document.getElementById('impuesto').value = cliente.impuesto; // Llenar el impuesto
        document.getElementById('administrador').value = cliente.administrador; // Llenar el administrador
    }
}


// Función para eliminar cliente
function eliminarCliente(id) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmacion) {
        let clientes = cargarClientesDesdeStorage();
        clientes = clientes.filter(cliente => cliente.id != id);
        localStorage.setItem('clientes', JSON.stringify(clientes)); // Guardar los cambios en localStorage
        cargarClientes(); // Recargar la tabla después de eliminar
    }
}

// Cargar clientes al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    mostrarMesActual(); // Mostrar el mes actual en la parte superior
    cargarClientes(); // Cargar clientes de localStorage
});

// Función para mostrar el mes actual
function mostrarMesActual() {
    const mesActual = obtenerMesActual();
    document.getElementById('mesActual').innerText = `Mes Actual: ${mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}`;
}

function realizarPago(id, totalAPagar) {
    // Abrir la página calculadora.html en una nueva pestaña pasando el ID y el total a pagar en la URL
    const url = `calculadora.html?clienteId=${id}&totalAPagar=${totalAPagar}`;
    window.open(url, '_blank'); // Abre en una nueva pestaña
}


function descargarTicket(clienteId) {
    const clientes = cargarClientesDesdeStorage(); // Cargar clientes del localStorage
    const cliente = clientes.find(c => c.id == clienteId);

    if (cliente) {
        const ticketContent = `
        Nombre Completo: ${cliente.nombre} ${cliente.apellido}
        Dirección: ${cliente.direccion}
        Fecha de Pago: ${new Date().toLocaleDateString('es-ES')}
        
        Detalles del Pago:
        Monto: $${cliente.monto.toFixed(2)}
        Expensas: $${cliente.expensas.toFixed(2)}
        Impuesto: $${cliente.impuesto.toFixed(2)}
        Total a Pagar: $${cliente.totalAPagar.toFixed(2)}
        Pago: ${cliente.pago}
        Administrador: ${cliente.administrador}
        `;

        // Crear un blob con el contenido del ticket
        const blob = new Blob([ticketContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ticket_pago_${cliente.nombre}_${cliente.apellido}.txt`; // Nombre del archivo
        link.click(); // Simular clic en el enlace para descargar
        URL.revokeObjectURL(link.href); // Liberar URL creada
    } else {
        alert("Cliente no encontrado.");
    }
}

function descargarTicket(clienteId) {
    const clientes = cargarClientesDesdeStorage();
    const cliente = clientes.find(c => c.id == clienteId);

    if (cliente) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Saludo de bienvenida
        doc.setFontSize(12);
        doc.text(`Recibo de pago de alquiler:`, 10, 10); 
        doc.text(`Estimado/a ${cliente.nombre} ${cliente.apellido},`, 10, 20);
        doc.text(`¡Gracias por su preferencia!`, 10, 30);
        
        // Separación
        doc.text(`----------------------------------------`, 10, 40);
        
        // Información del pago
        doc.text(`Nombre Completo: ${cliente.nombre} ${cliente.apellido}`, 10, 50);
        doc.text(`Dirección: ${cliente.direccion}`, 10, 60);
        doc.text(`Fecha de Pago: ${new Date().toLocaleDateString('es-ES')}`, 10, 70);
        
        // Separación
        doc.text(`----------------------------------------`, 10, 80);
        doc.text(`Detalles del Pago:`, 10, 90);
        doc.text(`Monto: $${cliente.monto.toFixed(2)}`, 10, 100);
        doc.text(`Expensas: $${cliente.expensas.toFixed(2)}`, 10, 110);
        doc.text(`Impuesto: $${cliente.impuesto.toFixed(2)}`, 10, 120);
        doc.text(`Total a Pagar: $${cliente.totalAPagar.toFixed(2)}`, 10, 130);
        doc.text(`Pago: ${cliente.pago}`, 10, 140);
        doc.text(`Administrador: ${cliente.administrador}`, 10, 150);
        
        // Separación
        doc.text(`----------------------------------------`, 10, 160);
        
        // Mensaje de despedida
        doc.text(`¡Gracias por su pago!`, 10, 170);
        doc.text(`Si tiene alguna consulta, no dude en contactarnos.`, 10, 180);

        // Descargar el PDF
        doc.save(`ticket_pago_${cliente.nombre}_${cliente.apellido}.pdf`);
    } else {
        alert("Cliente no encontrado.");
    }
}



