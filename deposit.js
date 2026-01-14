// ====== INICIALIZACIÓN DE SALDO Y TRANSACCIONES ======
function initializeSaldoTransactions() {
  // Inicializar saldo
  if (!localStorage.getItem('saldo')) {
    localStorage.setItem('saldo', '60000');
  }

  // Inicializar transacciones
  if (!localStorage.getItem('transactions')) {
    const defaultTransactions = [
      {
        type: 'deposit',
        amount: 60000,
        date: new Date().toISOString(),
        description: 'Depósito inicial',
        sign: '+'
      }
    ];
    localStorage.setItem('transactions', JSON.stringify(defaultTransactions));
  }
}

$(document).ready(function () {

  // Inicializar saldo y transacciones al cargar la página
  initializeSaldoTransactions();

  let saldo = Number(localStorage.getItem('saldo')) || 60000;
  $('#currentBalance').text(`$${saldo.toLocaleString()}`);

  $('#depositForm').submit(function (e) {
    e.preventDefault();

    const monto = Number($('#depositAmount').val());

    if (!monto || monto <= 0) {
      $('#alert-container').html(`
        <div class="alert alert-danger text-center">
          Ingresa un monto válido
        </div>
      `);
      return;
    }

    saldo += monto;
    localStorage.setItem('saldo', saldo);

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({
      type: 'deposit',
      amount: monto,
      date: new Date().toISOString(),
      description: 'Depósito',
      sign: '+'
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    $('#alert-container').html(`
      <div class="alert alert-success text-center">
        Depósito realizado con éxito
      </div>
    `);

    $('#deposit-info').html(`
      Has depositado <strong>$${monto.toLocaleString()}</strong>
    `);

    $('#currentBalance').text(`$${saldo.toLocaleString()}`);

    setTimeout(function () {
      window.location.href = 'menu.html';
    }, 2000);
  });

});

