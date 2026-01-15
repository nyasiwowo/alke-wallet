function initializeSaldoTransactions() {         // Inicializa el saldo y las transacciones si no existen
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;
  
  const userSaldoKey = `saldo_${currentUser.email}`;
  const userTransactionsKey = `transactions_${currentUser.email}`;
  
  if (!localStorage.getItem(userSaldoKey)) {
    localStorage.setItem(userSaldoKey, '60000');
  }

  if (!localStorage.getItem(userTransactionsKey)) {
    const defaultTransactions = [
      {
        type: 'deposit',
        amount: 60000,
        date: new Date().toISOString(),
        description: 'Depósito inicial',
        sign: '+'
      }
    ];
    localStorage.setItem(userTransactionsKey, JSON.stringify(defaultTransactions));
  }
}

$(document).ready(function () { 

  initializeSaldoTransactions();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userSaldoKey = `saldo_${currentUser.email}`;
  const userTransactionsKey = `transactions_${currentUser.email}`;

  let saldo = Number(localStorage.getItem(userSaldoKey));
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
    localStorage.setItem(userSaldoKey, saldo);

    const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || []; // Recupera las transacciones existentes
    transactions.push({
      type: 'deposit',
      amount: monto,
      date: new Date().toISOString(),
      description: 'Depósito',
      sign: '+'
    });
    localStorage.setItem(userTransactionsKey, JSON.stringify(transactions));

    $('#alert-container').html(`
      <div class="alert alert-success text-center">
        Depósito realizado con éxito
      </div>
    `);

    $('#deposit-info').html(`
      Has depositado <strong>$${monto.toLocaleString()}</strong> 
    `);

    $('#currentBalance').text(`$${saldo.toLocaleString()}`);     // Actualiza el saldo mostrado

    setTimeout(function () {     // Redirige al menú después de 2 segundos para que el usuario vea el mensaje
      window.location.href = 'menu.html';
    }, 2000);
  });

});

