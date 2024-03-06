// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    console.log('Clic en el menú hamburguesa');
    var enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    const carritoContainer = document.getElementById('carrito-container');
    const totalPedidoSpan = document.getElementById('totalPedido');

    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<p class="text-muted">El carrito está vacío.</p>';
    } else {
        // Crear el HTML para mostrar los productos en el carrito
        let carritoHTML = '<ul class="list-group">';

        // Inicializar el total del pedido
        let totalPedido = 0;

        carrito.forEach((producto, index) => {
            const ivaDecimal = producto.iva / 100;
            const precioConIva = producto.precio * (1 + ivaDecimal);
            totalPedido += precioConIva;

            // Asegurarse de que la cantidad sea al menos 1
            if (producto.cantidad < 1) {
                producto.cantidad = 1;
            }

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
                </div>
                <div class="col-md-3">
                    <label for="cantidad-${index}">Cantidad:</label>
                    <input class="cantidadSitio" type="number" id="cantidad-${index}" value="${producto.cantidad}" min="1" oninput="actualizarCantidad(${index}, this.value)" onkeypress="actualizarSubtotal(event, ${index})">
                    <button onclick="eliminarProducto(${index})" class="botonesPersonalizados">Eliminar</button>
                    <p>Subtotal: $<span class="textoResaltado" id="subtotal-${index}">${(precioConIva * producto.cantidad).toFixed(2)}</span></p>
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

function actualizarCantidad(index, nuevaCantidad) {
    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Actualizar la cantidad del producto en el carrito
    carrito[index].cantidad = parseInt(nuevaCantidad);

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el subtotal del producto y la cantidad en la página
    actualizarSubtotalElemento(index);
    actualizarCantidadElemento(index);
}


function actualizarSubtotal(event, index) {
    // Verificar si la tecla presionada es "Enter"
    if (event.key === 'Enter') {
        // Obtener el valor actualizado de la cantidad
        const nuevaCantidad = document.getElementById(`cantidad-${index}`).value;

        // Actualizar la cantidad en el carrito
        actualizarCantidad(index, nuevaCantidad);
    }
}

function actualizarSubtotalElemento(index) {
    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Obtener el precio y la cantidad del producto actualizado
    const producto = carrito[index];
    const ivaDecimal = producto.iva / 100;
    const precioConIva = producto.precio * (1 + ivaDecimal);

    // Calcular el nuevo subtotal y actualizar el elemento en la página
    const subtotal = (precioConIva * producto.cantidad).toFixed(2);
    document.getElementById(`subtotal-${index}`).textContent = subtotal;

    // Actualizar el total del pedido
    actualizarTotalPedido();
}

function actualizarCantidadElemento(index) {
    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Obtener la cantidad del producto actualizado
    const cantidad = carrito[index].cantidad;

    // Actualizar la cantidad del elemento en la página
    document.getElementById(`cantidad-${index}`).value = cantidad;
}

function actualizarTotalPedido() {
    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Calcular el nuevo total del pedido
    let totalPedido = carrito.reduce((total, producto) => {
        const ivaDecimal = producto.iva / 100;
        const precioConIva = producto.precio * (1 + ivaDecimal);
        return total + precioConIva * producto.cantidad;
    }, 0);

    // Mostrar el nuevo total del pedido en la página
    document.getElementById('totalPedido').textContent = totalPedido.toFixed(2);
}

function eliminarProducto(index) {
    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Eliminar el producto del carrito
    carrito.splice(index, 1);

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la página para reflejar la eliminación del producto
    location.reload();
}

function vaciarCarrito() {
    // Vaciar el carrito almacenado en el almacenamiento local
    localStorage.removeItem('carrito');

    // Actualizar la página para reflejar el carrito vacío
    location.reload();
}
// Descuentos:
function aplicarDescuento() {
    const codigoPromocional = document.getElementById('inputCodigoPromocional').value.toLowerCase();
    const descuentos = {
        'raul': 10,
        'luis': 5,
        'carlos': 15,
        'enrique': 30,
        'victor': 50,
        'manu': 80,
        
    };

    const descuentoAplicadoElemento = document.getElementById('descuentoAplicado');
    // comprobar que el codigo si existe
    if (descuentos.hasOwnProperty(codigoPromocional)) {
        const descuento = descuentos[codigoPromocional];
        descuentoAplicadoElemento.textContent = `Descuento aplicado: ${descuento}%`;
        
        // Llamas a una función para actualizar el total del pedido con el descuento
        aplicarDescuentoTotal(descuento);
    } else {
        descuentoAplicadoElemento.textContent = 'Código de descuento no válido';
    }
}

function aplicarDescuentoTotal(descuento) {
    // Obtener el carrito almacenado en el almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Calcular el nuevo total del pedido con descuento
    let totalPedido = carrito.reduce((total, producto) => {
        const ivaDecimal = producto.iva / 100;
        const precioConIva = producto.precio * (1 + ivaDecimal);
        return total + precioConIva * producto.cantidad;
    }, 0);

    // Aplicar el descuento al total del pedido
    totalPedido -= (totalPedido * descuento) / 100;

    // Mostrar el nuevo total del pedido en la página
    document.getElementById('totalPedido').textContent = totalPedido.toFixed(2);
}

