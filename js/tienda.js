// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    var enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento listo, ejecutando el script");

    let productos; // Guardamos nuestros productos.json en productos
    const productosPorPagina = 6; // Cantidad de productos que mostramos si son 18/6=3
    let paginaActual = 1; // Inicializo la pagina en 1

    // Ponemos los valores por defecto
    let filtroPrecioMinimo = 0;
    let filtroPrecioMaximo = Infinity;
    let filtroColor = "todos";

    fetch('js/productos.json')
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);

            productos = data.motos;
            mostrarProductos(productos);

            // Cogemos el botón de buscar y llamamos a la función buscarProductos
            document.getElementById("btnBuscar").addEventListener("click", buscarProductos);

            // Hacemos los botones para la paginación
            document.getElementById("btnPaginaAnterior").addEventListener("click", irPaginaAnterior);
            document.getElementById("btnPaginaSiguiente").addEventListener("click", irPaginaSiguiente);

            // Para poder usar la tecla enter al buscar
            document.getElementById("inputBusqueda").addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    buscarProductos();
                }
            });

            // Con el botón AplicarFiltro y llamamos a la función de aplicarFiltro para aplicar los filtros de precio y color
            document.getElementById("btnAplicarFiltro").addEventListener("click", aplicarFiltro);

            // Con el botón BorrarFiltros y llamamos a la función de borrarFiltros para borrar los filtros de precio y color y poner los de por defecto
            document.getElementById("btnBorrarFiltros").addEventListener("click", borrarFiltros);
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function mostrarProductos(productosMostrar) {
        // Filtra los productos según la paginación y los filtros
        const productosFiltrados = productosMostrar.filter(producto => {
            const precioCumple = producto.precio >= filtroPrecioMinimo && producto.precio <= filtroPrecioMaximo;
            const colorCumple = filtroColor === "todos" || producto.color.toLowerCase() === filtroColor;

            return precioCumple && colorCumple;
        });

        // Calcula el índice de inicio y fin para la paginación
        const indiceInicio = (paginaActual - 1) * productosPorPagina;
        const indiceFin = paginaActual * productosPorPagina;

        // Obtiene los productos de la página actual
        const productosPagina = productosFiltrados.slice(indiceInicio, indiceFin);

        // Crea el HTML para los productos
        let motosHTML = "";

        if (productosPagina.length === 0) {
            // Mostrar mensaje de error si no hay productos
            motosHTML = '<p>No se encontraron productos.</p>';
        }else {
            productosPagina.forEach(producto => {
                // Calcula el precio total con IVA
                const ivaDecimal = producto.iva / 100;
                const precioConIva = producto.precio * (1 + ivaDecimal);
    
                motosHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card m-3">
                            <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.marca} ${producto.modelo}</h5>
                                <p class="card-text">Color: ${producto.color}</p>
                                <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                                <p class="card-text">IVA: $${(precioConIva - producto.precio).toFixed(2)}</p>
                                <p class="card-text">Precio + IVA: $${precioConIva.toFixed(2)}</p>
                                <a href="#" class="btn btn-primary btn-detalle">Detalles</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Agrega los productos al contenedor
        document.getElementById("productos-container").innerHTML = motosHTML;

        // Actualiza el número de página actual
        document.getElementById("paginaActual").textContent = paginaActual;

        // Agrega eventos a los botones de detalles
        agregarEventosDetalles(productosPagina);
    }

    function agregarEventosDetalles(productosMostrar) {
        const botonesDetalles = document.querySelectorAll('.btn-detalle');

        botonesDetalles.forEach((boton, index) => {
            boton.addEventListener('click', function () {
                mostrarDetalleProducto(productosMostrar[index]);
            });

            // Agregar evento al botón "Agregar al Carrito"
            const botonCarrito = document.createElement('button');
            botonCarrito.className = 'btn btn-secondary btn-carrito';
            botonCarrito.textContent = 'Agregar al Carrito';
            botonCarrito.addEventListener('click', function () {
                agregarAlCarrito(productosMostrar[index]);
            });

            boton.parentNode.insertBefore(botonCarrito, boton.nextSibling);
        });
    }

    function agregarAlCarrito(producto) {
        // Obtener el carrito almacenado en el almacenamiento local
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Agregar el producto al carrito
        carrito.push(producto);

        // Guardar el carrito actualizado en el almacenamiento local
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Redirigir a la página del carrito
        // window.location.href = 'carrito.html';
    }

    function mostrarDetalleProducto(producto) {
        // Almacena la información del producto en el almacenamiento local
        localStorage.setItem('productoSeleccionado', JSON.stringify(producto));

        // Redirige a la página de detalles del producto
        window.location.href = 'detalleProducto.html';
    }

    function buscarProductos() {
        const busqueda = document.getElementById("inputBusqueda").value.toLowerCase();
        const productosFiltrados = productos.filter(producto => {
            const nombreProducto = `${producto.marca} ${producto.modelo}`.toLowerCase();
            return nombreProducto.includes(busqueda);
        });

        // Reinicia la paginación a la primera página al realizar una búsqueda
        paginaActual = 1;

        mostrarProductos(productosFiltrados);
    }

    function irPaginaAnterior() {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarProductos(productos);
        }
    }

    function irPaginaSiguiente() {
        const totalPaginas = Math.ceil(productos.length / productosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarProductos(productos);
        }
    }

    function aplicarFiltro() {
        // Actualiza los valores de los filtros
        filtroPrecioMinimo = parseFloat(document.getElementById("inputPrecioMinimo").value) || 0;
        filtroPrecioMaximo = parseFloat(document.getElementById("inputPrecioMaximo").value) || Infinity;
        filtroColor = document.getElementById("selectColor").value.toLowerCase();

        // Reinicia la paginación a la primera página al aplicar el filtro
        paginaActual = 1;

        mostrarProductos(productos);
    }

    function borrarFiltros() {
        // Restaura los valores de los filtros a sus valores predeterminados
        filtroPrecioMinimo = 0;
        filtroPrecioMaximo = Infinity;
        filtroColor = "todos";

        // Reinicia la paginación a la primera página al borrar los filtros
        paginaActual = 1;

        // Limpia los valores de los inputs y selects de filtros
        document.getElementById("inputPrecioMinimo").value = "";
        document.getElementById("inputPrecioMaximo").value = "";
        document.getElementById("selectColor").value = "todos";

        // Muestra todos los productos sin filtros
        mostrarProductos(productos);
    }
});
