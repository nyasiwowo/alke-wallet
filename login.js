$(document).ready(function () {

  $('#loginForm').submit(function (e) {
    e.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    const validEmail = 'admin@wallet.cl';
    const validPassword = '123456';

    if (email === validEmail && password === validPassword) {

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

});
