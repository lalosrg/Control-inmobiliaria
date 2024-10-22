// Función para calcular el total
function calcularTotal() {
  // Obtener el monto a pagar
  const montoPagar = parseFloat(document.getElementById('montoPagar').value) || 0;

  // Obtener las cantidades de billetes ingresadas
  const cantidades = [
      parseInt(document.getElementById('billetes100').value) || 0,
      parseInt(document.getElementById('billetes200').value) || 0,
      parseInt(document.getElementById('billetes500').value) || 0,
      parseInt(document.getElementById('billetes1000').value) || 0,
      parseInt(document.getElementById('billetes2000').value) || 0,
      parseInt(document.getElementById('billetes10000').value) || 0
  ];

  const denominaciones = [100, 200, 500, 1000, 2000, 10000];

  // Calcular los totales por cada denominación
  let montoTotal = 0;
  for (let i = 0; i < cantidades.length; i++) {
      const total = cantidades[i] * denominaciones[i];
      document.getElementById(`total${denominaciones[i]}`).textContent = total;
      montoTotal += total;
  }

  // Mostrar el monto total
  document.getElementById('montoTotal').textContent = montoTotal;

  // Calcular el monto restante
  const montoRestante = montoPagar > montoTotal ? montoPagar - montoTotal : 0;
  document.getElementById('montoRestante').textContent = montoRestante;

  // Calcular el vuelto
  const vuelto = montoTotal - montoPagar;
  document.getElementById('vuelto').textContent = vuelto >= 0 ? vuelto : 0;
}

// Función para obtener los parámetros de la URL
function obtenerParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  return {
      clienteId: params.get('clienteId'),
      totalAPagar: parseFloat(params.get('totalAPagar')) || 0 // Convertir a número
  };
}

// Función para cargar el valor de "Total a pagar" en el campo "Monto a pagar"
document.addEventListener('DOMContentLoaded', function() {
  const { totalAPagar } = obtenerParametrosURL();
  
  if (totalAPagar) {
      document.getElementById('montoPagar').value = totalAPagar; // Colocar el valor en el campo
      calcularTotal(); // Llamar a la función calcularTotal después de cargar el monto
  }
});

// Función para realizar el pago con punitorios
function realizarPago(id) {
  // Obtener los valores de los inputs y asegurarse de que son números válidos
  const diasAtraso = parseFloat(document.getElementById('diasAtraso').value) || 0;
  const punitoriosPorcentaje = parseFloat(document.getElementById('punitoriosPorcentaje').value) || 0;

  // Obtener el total a pagar de los parámetros
  const { totalAPagar } = obtenerParametrosURL();

  // Calcular los punitorios
  const punitorios = totalAPagar * (punitoriosPorcentaje / 100) * diasAtraso;

  // Calcular el total final con punitorios
  const totalFinal = totalAPagar + punitorios;

  // Actualizar el campo de "Monto a pagar" con el total final que incluye los punitorios
  document.getElementById('montoPagar').value = totalFinal.toFixed(2);

  // Redirigir a la calculadora con el total ajustado
  const url = `calculadora.html?clienteId=${id}&totalAPagar=${totalFinal.toFixed(2)}`;
  window.open(url, '_blank'); // Abre en una nueva pestaña
}

function actualizarPagoCliente() {
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get('clienteId');

  if (clienteId) {
      let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
      const clienteIndex = clientes.findIndex(cliente => cliente.id == clienteId);

      if (clienteIndex > -1) {
          clientes[clienteIndex].pago = 'Sí'; // Actualizar el estado de pago a "Sí"
          localStorage.setItem('clientes', JSON.stringify(clientes)); // Guardar los cambios

          // Redirigir a la página principal (index.html)
          window.location.href = 'index.html'; // Cambiar a index.html después de marcar como pagado
      }
  }
}
