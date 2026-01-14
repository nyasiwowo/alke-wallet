$(document).ready(function () {

  // Inicializar saldo y transacciones al cargar la página
  initializeSaldoTransactions();
  
  let saldo = Number(localStorage.getItem('saldo')) || 60000;
  localStorage.setItem('saldo', saldo);

  $('#saldo').text(`$${saldo.toLocaleString('es-CL')}`);

  $('#btnDeposit').click(function () {
    redirect('Depositar', 'deposit.html');
  });

  $('#btnSend').click(function () {
    redirect('Enviar Dinero', 'sendmoney.html');
  });

  $('#btnTransactions').click(function () {
    redirect('Últimos Movimientos', 'transactions.html');
  });

  // Cerrar sesión: limpiar claves de sesión y redirigir a login
  $('#logoutBtn').click(function () {
    // Eliminar posibles claves de sesión (si existen)
    try {
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    } catch (e) {}

    $('#message').html(`<div class="alert alert-secondary text-center">Cerrando sesión...</div>`);
    setTimeout(function () { window.location.href = 'login.html'; }, 600);
  });

  function redirect(screenName, url) {
    $('#message').html(`
      <div class="alert alert-info text-center">
        Redirigiendo a <strong>${screenName}</strong>...
      </div>
    `);

    setTimeout(function () {
      window.location.href = url;
    }, 1000);
  }

});
