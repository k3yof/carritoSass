// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function () {
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
        window.location.href = 'index.html';
    }
});

function mostrarDetalles(producto) {
    const detallesProducto = document.getElementById('detallesProducto');

    // Crea el HTML para mostrar los detalles del producto con carrusel
    const detallesHTML = `
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                ${producto.imagenes.map((imagen, index) => `
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>
                `).join('')}
            </div>
            <div class="carousel-inner">
                ${producto.imagenes.map((imagen, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${imagen}" class="d-block w-100" alt="${producto.marca} ${producto.modelo}">
                    </div>
                `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="producto-info">
            <h5 class="producto-titulo">${producto.marca} ${producto.modelo}</h5>
            <p class="producto-datos">Color: ${producto.color}</p>
            <p class="producto-datos">Color: ${producto.categoria}</p>
            <p class="producto-datos">Precio: $${producto.precio}</p>
            <p class="producto-datos">Iva: ${producto.iva}%</p>
            <a href="../tienda.html" class="botonesPersonalizados">Volver a tienda</a>
        </div>
    `;

    detallesProducto.innerHTML = detallesHTML;

    // Inicializa el carrusel usando Bootstrap
    const detallesCarousel = new bootstrap.Carousel(document.getElementById('carouselExampleIndicators'));

    // Agrega evento al cambio de slide para actualizar la información del producto
    detallesCarousel._element.addEventListener('slide.bs.carousel', function (event) {
        const indiceSlide = event.to; // Índice del nuevo slide
        // Puedes actualizar el contenido del producto según el índice del slide si es necesario
    });
}
