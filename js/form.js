// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    console.log('Clic en el menú hamburguesa');
    let enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

function validarFormulario(event) {
    event.preventDefault();

    let nombre = document.getElementById('nombre').value.trim();
    let email = document.getElementById('email').value.trim();
    let mensaje = document.getElementById('mensaje').value.trim();

    if (!validarCampoTexto(nombre)) {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }

    if (!validarEmail(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    if (!validarCampoTexto(mensaje)) {
        alert("Por favor, ingresa un mensaje válido.");
        return;
    }

    alert(`¡Hola ${nombre}! Gracias por tu mensaje.`);

    document.getElementById('contactForm').reset();
}

function validarCampoTexto(valor) {
    // Validar que el campo contenga solo letras y espacios
    let regex = /^[A-Za-z\s]+$/;
    return regex.test(valor);
}

function validarEmail(email) {
    // Expresión regular para validar un correo electrónico
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
