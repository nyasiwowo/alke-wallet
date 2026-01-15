// Crear usuario admin por defecto si no existe ninguno
function initializeUsers() {
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        fullName: 'Admin Usuario',
        email: 'admin@wallet.cl',
        password: '123456',
        cbu: '69696969696969696969696',
        bank: 'Banco Admin',
        registeredDate: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
}

$(document).ready(function () {

  // Inicializar usuarios al cargar la página
  initializeUsers();

  // Manejo del formulario de login
  $('#loginForm').submit(function (e) {
    e.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    // Obtener usuarios registrados del localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar usuario con ese email y contraseña
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Guardar usuario logueado en localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Inicializar saldo y transacciones si no existen para este usuario
      const userSaldoKey = `saldo_${email}`;
      const userTransactionsKey = `transactions_${email}`;
      
      if (!localStorage.getItem(userSaldoKey)) {
        localStorage.setItem(userSaldoKey, '60000');
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

      $('#message').html(`
        <div class="alert alert-success text-center">
          Inicio de sesión exitoso. Redirigiendo...
        </div>
      `);

      setTimeout(function () {
        window.location.href = './menu.html';
      }, 1000);

    } else {
      $('#message').html(`
        <div class="alert alert-danger text-center">
          Email o contraseña incorrectos.
        </div>
      `);
    }
  });

  // Manejo del botón Registrarse
  $('#registerBtn').click(() => {
    $('#registerOverlay').removeClass('d-none');
    $('#registerMessage').html('');
    $('#registerForm')[0].reset();
  });

  $('#cancelRegister').click(() => {
    $('#registerOverlay').addClass('d-none');
    $('#registerMessage').html('');
  });

  // Manejo del formulario de registro
  $('#registerForm').submit(function (e) {
    e.preventDefault();

    const fullName = $('#fullName').val().trim();
    const registerEmail = $('#registerEmail').val().trim();
    const registerPassword = $('#registerPassword').val().trim();
    const registerCBU = $('#registerCBU').val().trim();
    const registerBank = $('#registerBank').val().trim();

    // Validar que todos los campos estén completos
    if (!fullName || !registerEmail || !registerPassword || !registerCBU || !registerBank) {
      $('#registerMessage').html(`
        <div class="alert alert-danger text-center">Todos los campos son obligatorios</div>
      `);
      return;
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (registerPassword.length < 6) {
      $('#registerMessage').html(`
        <div class="alert alert-danger text-center">La contraseña debe tener al menos 6 caracteres</div>
      `);
      return;
    }

    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si el email ya está registrado
    if (users.some(u => u.email === registerEmail)) {
      $('#registerMessage').html(`
        <div class="alert alert-danger text-center">Este email ya está registrado</div>
      `);
      return;
    }

    // Agregar nuevo usuario
    const newUser = {
      fullName: fullName,
      email: registerEmail,
      password: registerPassword,
      cbu: registerCBU,
      bank: registerBank,
      registeredDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Inicializar saldo y transacciones para el nuevo usuario
    const userSaldoKey = `saldo_${registerEmail}`;
    const userTransactionsKey = `transactions_${registerEmail}`;
    const userContactsKey = `contacts_${registerEmail}`;
    
    localStorage.setItem(userSaldoKey, '60000');
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
    
    // Inicializar contactos por defecto para el nuevo usuario
    const defaultContacts = [
      {
        name: 'Juan Pérez',
        alias: 'juanperez',
        cbu: '0000003100060386521879',
        bank: 'Banco Nación'
      },
      {
        name: 'María García',
        alias: 'mariagarcia',
        cbu: '0000003100060386521880',
        bank: 'BBVA'
      }
    ];
    localStorage.setItem(userContactsKey, JSON.stringify(defaultContacts));

    // Mostrar mensaje de éxito
    $('#registerMessage').html(`
      <div class="alert alert-success text-center">
        Registro exitoso. Ahora puedes iniciar sesión.
      </div>
    `);

    // Limpiar formulario y cerrar modal después de 2 segundos
    setTimeout(() => {
      $('#registerOverlay').addClass('d-none');
      $('#registerForm')[0].reset();
      $('#registerMessage').html('');
      $('#email').val(registerEmail); // Pre-llenar email en login
    }, 2000);
  });

});
