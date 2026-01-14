$(document).ready(function () {

  let selectedIndex = null;


  $('#addContactBtn').click(() => {
    $('#contactOverlay').removeClass('d-none');
    $('#contactFormMessage').html('');
  });
  $('#cancelContact').click(() => {
    $('#contactOverlay').addClass('d-none');
    $('#contactFormMessage').html('');
  });


  function handleSaveContact(e) {
    if (e && e.preventDefault) e.preventDefault();

    const name = $('#name').val().trim();
    const cbu = $('#cbu').val().trim();
    const alias = $('#alias').val().trim();
    const bank = $('#bank').val().trim();

    if (!name || !cbu || !alias || !bank) {
      $('#contactFormMessage').html(`
        <div class="alert alert-danger text-center">Todos los campos son obligatorios</div>
      `);
      return;
    }

    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push({ name, cbu, alias, bank });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    console.log('handleSaveContact: saved contact', { name, cbu, alias, bank });
    console.log('handleSaveContact: contacts in localStorage', contacts);

    $('#contactOverlay').addClass('d-none');
    $('#contactForm')[0].reset();
    $('#contactFormMessage').html('');
    $('#searchInput').val('');
    renderContacts('');
  }


  $('#contactForm').submit(handleSaveContact);
  $('#saveContact').click(handleSaveContact);


  $('#searchInput').on('input', function () {
    renderContacts($(this).val().toLowerCase());
  });


  function renderContacts(filter = '') {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    console.log('renderContacts: called with filter=', filter, 'contacts.length=', contacts.length);
    $('#contactList').empty();
    selectedIndex = null;
    $('#sendBtn').addClass('d-none');

    if (!contacts.length) {
      $('#contactList').html('<li class="list-group-item text-muted text-center">Sin contactos</li>');
      return;
    }

    contacts.forEach((c, index) => {
      if (!c || typeof c !== 'object') {
        console.warn('renderContacts: contacto inválido, se omite', c, index);
        return;
      }

      const nameStr = c.name ? String(c.name).toLowerCase() : '';
      const aliasStr = c.alias ? String(c.alias).toLowerCase() : '';

      if (nameStr.includes(filter) || aliasStr.includes(filter)) {
        const item = $(`
          <li class="list-group-item list-group-item-action">
            <strong>${c.name || ''}</strong><br>
            <small>${c.bank || ''} · ${c.alias || ''}</small>
          </li>
        `);

        item.click(() => {
          $('.list-group-item').removeClass('active');
          item.addClass('active');
          selectedIndex = index;
          $('#sendBtn').removeClass('d-none');
        });

        $('#contactList').append(item);
      }
    });
  }


  $('#sendBtn').click(() => $('#amountOverlay').removeClass('d-none'));
  $('#cancelAmount').click(() => $('#amountOverlay').addClass('d-none'));

  $('#confirmSend').click(function () {
    const monto = Number($('#amountInput').val());
    let saldo = Number(localStorage.getItem('saldo')) || 0;

    if (!monto || monto <= 0) {
      showMessage('Monto inválido', 'danger');
      return;
    }

    if (monto > saldo) {
      showMessage('Saldo insuficiente', 'danger');
      return;
    }

    saldo -= monto;
    localStorage.setItem('saldo', saldo);

    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact = contacts[selectedIndex];

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({
      type: 'transfer',
      amount: monto,
      date: new Date().toISOString(),
      description: `Transferencia a ${contact.name}`,
      sign: '-'
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    $('#amountOverlay').addClass('d-none');


    if (typeof showBottomMessage === 'function') {
      showBottomMessage('Transferencia realizada con éxito', 'success', 2000);
    }

    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 2000);
  });

  function showMessage(text, type) {
    $('#message').html(`
      <div class="alert alert-${type} text-center">${text}</div>
    `);
  }


  function showBottomMessage(text, type = 'success', duration = 3000) {
    const alert = $(`<div class="alert alert-${type} text-center">${text}</div>`);
    $('#bottomAlertContainer').append(alert);
    setTimeout(() => {
      alert.fadeOut(200, () => alert.remove());
    }, duration);
  }

  renderContacts();
});

