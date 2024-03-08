// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    let enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    // Obtiene la información del producto almacenada en el almacenamiento local
    const productoSeleccionado = JSON.parse(localStorage.getItem('productoSeleccionado'));

    if (productoSeleccionado) {
        // Muestra los detalles del producto en la página
        mostrarDetalles(productoSeleccionado);
    } else {
        // Si no hay información del producto, redirige a la página principal
        window.location.href = 'tienda.html';
    }
});

function mostrarDetalles(producto) {
    const detallesCarousel = document.getElementById('product-carousel');
    const detallesNombre = document.getElementById('product-name');
    const detallesPrecio = document.getElementById('product-price');
    const detallesDescripcion = document.getElementById('product-description');
    const detallesMarca = document.getElementById('product-brand');

    // Configura el carrusel de imágenes
    detallesCarousel.innerHTML = `
        <div class="carousel-inner product-links-wap" role="listbox">
            ${producto.imagenes.map((imagen, index) => `
                <div class="carousel-item">
                    <img src="${imagen}" class="imagenesCar" alt="${producto.marca} ${producto.modelo}">
                </div>
            `).join('')}
        </div>
        <div class="row d-flex justify-content-center mb-5">
            <a href="#product-carousel" role="button" data-bs-slide="prev" class="col-2 align-self-center text-center">
                <i class="text-dark fas fa-chevron-left"></i>
            </a>
            <a href="#product-carousel" role="button" data-bs-slide="next" class="col-2 align-self-center text-center">
                <i class="text-dark fas fa-chevron-right"></i>
            </a>
        </div>
    `;

    // Rellena el contenido dinámico de los detalles del producto
    detallesNombre.textContent = `${producto.marca} ${producto.modelo}`;
    detallesPrecio.textContent = `Precio: $${producto.precio}`;
    detallesMarca.textContent = `Marca: ${producto.marca}`;

    // Rellena las especificaciones del producto
    detallesEspecificaciones.innerHTML = producto.especificaciones.map(spec => `<li>${spec}</li>`).join('');
}

