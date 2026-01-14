$(document).ready(function () {

  // Inicializar transacciones al cargar la página
  initializeSaldoTransactions();

  const listaTransacciones = JSON.parse(localStorage.getItem('transactions')) || [];


  $('#filterType').change(function () {
    const filtro = $(this).val();
    mostrarUltimosMovimientos(filtro);
  });


  function mostrarUltimosMovimientos(filtro) {
    const list = $('#transactionList');
    list.empty();

    if (!listaTransacciones.length) {
      list.html(`
        <li class="list-group-item text-center text-muted">
          No hay movimientos registrados
        </li>
      `);
      return;
    }

    let filtradas = listaTransacciones;

    if (filtro !== 'all') {
      filtradas = listaTransacciones.filter(t => t.type === filtro);
    }

    if (!filtradas.length) {
      list.html(`
        <li class="list-group-item text-center text-muted">
          No hay movimientos para este filtro
        </li>
      `);
      return;
    }

    filtradas.slice().reverse().forEach(t => {
      list.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong class="solid-dark">${getTipoTransaccion(t.type)}</strong><br>
            <small class="solid-dark">${t.description || ''}</small>
          </div>
          <span class="${t.sign === '-' ? 'text-danger' : 'text-success'} font-weight-bold">
            ${t.sign} $${Number(t.amount).toLocaleString('es-CL')}
          </span>
        </li>
      `);
    });
  }

  function getTipoTransaccion(tipo) {
    switch (tipo) {
      case 'deposit':
        return 'Depósito';
      case 'transfer':
        return 'Transferencia';
      default:
        return 'Movimiento';
    }
  }

  mostrarUltimosMovimientos('all');

});
