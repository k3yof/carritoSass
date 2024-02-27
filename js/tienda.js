document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento listo, ejecutando el script");

    let productos; // Almacena todos los productos
    const productosPorPagina = 6; // Puedes ajustar la cantidad de productos por página
    let paginaActual = 1;

    fetch('js/productos.json')
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);

            productos = data.motos;
            mostrarProductos(productos);

            // Agregar evento al botón de búsqueda
            document.getElementById("btnBuscar").addEventListener("click", buscarProductos);

            // Agregar evento a los botones de paginación
            document.getElementById("btnPaginaAnterior").addEventListener("click", irPaginaAnterior);
            document.getElementById("btnPaginaSiguiente").addEventListener("click", irPaginaSiguiente);

            // Agregar evento para escuchar la tecla Enter en el input de búsqueda
            document.getElementById("inputBusqueda").addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    buscarProductos();
                }
            });

            // Agregar evento al botón de aplicar filtro de precio y color
            document.getElementById("btnAplicarFiltro").addEventListener("click", aplicarFiltro);
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function mostrarProductos(productosMostrar) {
        // Calcula el índice de inicio y fin para la paginación
        const indiceInicio = (paginaActual - 1) * productosPorPagina;
        const indiceFin = paginaActual * productosPorPagina;

        // Filtra los productos según la paginación
        const productosPagina = productosMostrar.slice(indiceInicio, indiceFin);

        // Crea el HTML para los productos
        let motosHTML = "";

        if (productosPagina.length === 0) {
            // Mostrar mensaje de error si no hay productos
            motosHTML = '<p>No se encontraron productos.</p>';
        } else {
            productosPagina.forEach(producto => {
                motosHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card m-3">
                            <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.marca} ${producto.modelo}</h5>
                                <p class="card-text">Color: ${producto.color}</p>
                                <p class="card-text">Precio: $${producto.precio}</p>
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
        });
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
        const precioMinimo = parseFloat(document.getElementById("inputPrecioMinimo").value) || 0;
        const precioMaximo = parseFloat(document.getElementById("inputPrecioMaximo").value) || Infinity;
        const colorFiltro = document.getElementById("selectColor").value.toLowerCase();

        const productosFiltrados = productos.filter(producto => {
            const precioCumple = producto.precio >= precioMinimo && producto.precio <= precioMaximo;
            const colorCumple = colorFiltro === "todos" || producto.color.toLowerCase() === colorFiltro;

            return precioCumple && colorCumple;
        });

        // Reinicia la paginación a la primera página al aplicar el filtro
        paginaActual = 1;

        mostrarProductos(productosFiltrados);
    }
});
