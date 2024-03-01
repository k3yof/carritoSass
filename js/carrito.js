// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    var enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});
document.addEventListener("DOMContentLoaded", function () {
    const carritoContainer = document.getElementById('carrito-container');
    const totalPedidoSpan = document.getElementById('totalPedido');

    // Obtener el carrito almacenado en el almacenamiento local
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<p class="text-muted">El carrito está vacío.</p>';
    } else {
        // Crear el HTML para mostrar los productos en el carrito
        let carritoHTML = '<ul class="list-group">';

        // Inicializar el total del pedido
        let totalPedido = 0;

        carrito.forEach(producto => {
            const ivaDecimal = producto.iva / 100;
            const precioConIva = producto.precio * (1 + ivaDecimal);
            totalPedido += precioConIva;
        
            carritoHTML += `
            <div class="row mb-2">
                <div class="col-md-3">
                    <img src="${producto.imagen}" alt="${producto.marca} ${producto.modelo}" class="img-fluid">
                </div>
                <div class="col-md-6">
                    <h6>${producto.marca} ${producto.modelo}</h6>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <p>IVA: $${(precioConIva - producto.precio).toFixed(2)}</p>
                    <p>Precio + IVA: $${precioConIva.toFixed(2)}</p>
                    <p>-------------------------</p>
                </div>
            </div>
            `;
        });
        carritoHTML += '</ul>';

        // Mostrar los productos en el carrito
        carritoContainer.innerHTML = carritoHTML;

        // Mostrar el total del pedido
        totalPedidoSpan.textContent = totalPedido.toFixed(2);
    }
});

function vaciarCarrito() {
    // Vaciar el carrito almacenado en el almacenamiento local
    localStorage.removeItem('carrito');

    // Actualizar la página para reflejar el carrito vacío
    location.reload();
}
