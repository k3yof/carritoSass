// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function () {
    let enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento listo, ejecutando el script");

    let productos;
    const productosPorPagina = 8;
    let paginaActual = 1;

    let filtroPrecioMinimo = 0;
    let filtroPrecioMaximo = Infinity;
    let filtroColor = "todos";
    let filtroCategoria = "todos";
    let ordenAscendente = true;

    fetch('js/productos.json')
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);

            productos = data.motos;
            mostrarProductos(productos);

            document.getElementById("btnBuscar").addEventListener("click", buscarProductos);
            document.getElementById("btnPaginaAnterior").addEventListener("click", irPaginaAnterior);
            document.getElementById("btnPaginaSiguiente").addEventListener("click", irPaginaSiguiente);

            document.getElementById("inputBusqueda").addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    buscarProductos();
                }
            });
            document.getElementById("btnAplicarFiltro").addEventListener("click", aplicarFiltro);
            document.getElementById("btnBorrarFiltros").addEventListener("click", borrarFiltros);
            document.getElementById("btnOrdenar").addEventListener("click", cambiarOrden);

            const categorias = ["todos", "deportiva", "naked", "cross", "niño"];
            llenarOpcionesSelect("selectCategoria", categorias);
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function llenarOpcionesSelect(idSelect, opciones) {
        const selectElement = document.getElementById(idSelect);

        opciones.forEach(opcion => {
            const option = document.createElement("option");
            option.value = opcion;
            option.textContent = opcion.charAt(0).toUpperCase() + opcion.slice(1);
            selectElement.appendChild(option);
        });
    }

    function mostrarProductos(productosMostrar) {
        const productosFiltrados = filtrarProductos(productosMostrar);
        const productosOrdenados = ordenarProductos(productosFiltrados);
        const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);
        const productosPagina = obtenerProductosPagina(productosOrdenados, totalPaginas);

        mostrarProductosHTML(productosPagina, totalPaginas);
        mostrarBotonesNumerados(totalPaginas);
        agregarEventosDetalles(productosPagina);
    }

    function filtrarProductos(productosMostrar) {
        return productosMostrar.filter(producto => {
            const precioCumple = producto.precio >= filtroPrecioMinimo && producto.precio <= filtroPrecioMaximo;
            const colorCumple = filtroColor === "todos" || producto.color.toLowerCase() === filtroColor;
            const categoriaCumple = filtroCategoria === "todos" || producto.categoria.toLowerCase() === filtroCategoria;

            return precioCumple && colorCumple && categoriaCumple;
        });
    }

    function obtenerProductosPagina(productosOrdenados, totalPaginas) {
        const indiceInicio = (paginaActual - 1) * productosPorPagina;
        const indiceFin = paginaActual * productosPorPagina;
        return productosOrdenados.slice(indiceInicio, indiceFin);
    }

    function mostrarProductosHTML(productosPagina, totalPaginas) {
        const productosContainer = document.getElementById("productos-container");
        const paginaActualElement = document.getElementById("paginaActual");
        let motosHTML = "";

        if (productosPagina.length === 0) {
            motosHTML = '<p>No se encontraron productos.</p>';
        } else {
            productosPagina.forEach(producto => {
                const precioConIva = calcularPrecioConIva(producto);

                motosHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="producto-card m-3">
                            <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
                            <div class="producto-info">
                                <h5 class="producto-titulo">${producto.marca} ${producto.modelo}</h5>
                                <p class="producto-datos">Color: ${producto.color}</p>
                                <p class="producto-datos">Categoría: ${producto.categoria}</p>
                                <p class="producto-datos">Precio: €${producto.precio.toFixed(2)}</p>
                                <p class="producto-datos">IVA: €${(precioConIva - producto.precio).toFixed(2)}</p>
                                <p class="producto-datos">Precio + IVA: €${precioConIva.toFixed(2)}</p>
                                <a href="#" class="botonesPersonalizados btn-detalle">Detalles</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        if (paginaActualElement) {
            paginaActualElement.textContent = paginaActual;
        }

        productosContainer.innerHTML = motosHTML;
    }

    function calcularPrecioConIva(producto) {
        const ivaDecimal = producto.iva / 100;
        return producto.precio * (1 + ivaDecimal);
    }

    function mostrarBotonesNumerados(totalPaginas) {
        const paginasNumeradas = document.getElementById("paginasNumeradas");
        paginasNumeradas.innerHTML = ""; // Limpiar contenido anterior

        const botonesMostrados = 3;
        let inicio = Math.max(1, paginaActual - 1);
        let fin = Math.min(inicio + botonesMostrados - 1, totalPaginas);

        inicio = Math.max(1, fin - botonesMostrados + 1);

        if (inicio > 1) {
            agregarBotonNumerado(paginasNumeradas, 1);
        }

        for (let i = inicio; i <= fin; i++) {
            agregarBotonNumerado(paginasNumeradas, i);
        }

        if (fin < totalPaginas) {
            agregarBotonNumerado(paginasNumeradas, totalPaginas);
        }
    }

    function agregarBotonNumerado(paginasNumeradas, numeroPagina) {
        const boton = document.createElement("button");
        boton.classList.add("botonesPersonalizados");
        boton.textContent = numeroPagina;
        boton.addEventListener("click", function () {
            paginaActual = numeroPagina;
            mostrarProductos(productos);
        });
        if (numeroPagina === paginaActual) {
            boton.classList.add("pagina-actual");
        }
        paginasNumeradas.appendChild(boton);
    }

    function ordenarProductos(productos) {
        if (ordenAscendente) {
            console.log("Ordenados de menor a mayor");
            return productos.sort((a, b) => a.precio - b.precio);
        } else {
            console.log("Ordenados de mayor a menor");
            return productos.sort((a, b) => b.precio - a.precio);
        }
    }

    function cambiarOrden() {
        ordenAscendente = !ordenAscendente;
        mostrarProductos(productos);
    }

    function agregarEventosDetalles(productosMostrar) {
        const botonesDetalles = document.querySelectorAll('.btn-detalle');

        botonesDetalles.forEach((boton, index) => {
            boton.addEventListener('click', function () {
                mostrarDetalleProducto(productosMostrar[index]);
            });

            const botonCarrito = document.createElement('button');
            botonCarrito.className = 'botonesPersonalizados';
            botonCarrito.textContent = 'Agregar al Carrito';
            botonCarrito.addEventListener('click', function () {
                agregarAlCarrito(productosMostrar[index]);
            });

            boton.parentNode.insertBefore(botonCarrito, boton.nextSibling);
        });
    }

    function agregarAlCarrito(producto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        const productoExistente = carrito.find(item => item.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function mostrarDetalleProducto(producto) {
        localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
        window.location.href = 'detalleProducto.html';
    }

    function buscarProductos() {
        const busqueda = document.getElementById("inputBusqueda").value.toLowerCase();
        const productosFiltrados = productos.filter(producto => {
            const nombreProducto = `${producto.marca} ${producto.modelo}`.toLowerCase();
            return nombreProducto.includes(busqueda);
        });

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
        filtroPrecioMinimo = parseFloat(document.getElementById("inputPrecioMinimo").value) || 0;
        filtroPrecioMaximo = parseFloat(document.getElementById("inputPrecioMaximo").value) || Infinity;
        filtroColor = document.getElementById("selectColor").value.toLowerCase();
        filtroCategoria = document.getElementById("selectCategoria").value.toLowerCase();

        paginaActual = 1;
        mostrarProductos(productos);
    }

    function borrarFiltros() {
        filtroPrecioMinimo = 0;
        filtroPrecioMaximo = Infinity;
        filtroColor = "todos";
        filtroCategoria = "todos";

        document.getElementById("inputPrecioMinimo").value = "";
        document.getElementById("inputPrecioMaximo").value = "";
        document.getElementById("selectColor").value = "todos";
        document.getElementById("selectCategoria").value = "todos";

        paginaActual = 1;
        mostrarProductos(productos);
    }

});
