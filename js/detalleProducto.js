
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

    // Crea el HTML para mostrar los detalles del producto
    const detallesHTML = `
        <div class="card">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
            <div class="card-body">
                <h5 class="card-title">${producto.marca} ${producto.modelo}</h5>
                <p class="card-text">Color: ${producto.color}</p>
                <p class="card-text">Precio: $${producto.precio}</p>
                <a href="../tienda.html" class="btn btn-secondary">Volver a tienda</a>
            </div>
        </div>
    `;

    detallesProducto.innerHTML = detallesHTML;
}