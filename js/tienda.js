// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    var enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.getElementById('mobile-menu').addEventListener('click', function () {
    var enlaces = document.querySelector('.enlaces');
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
    let ordenAscendente = true; // Nuevo: Variable para rastrear el orden

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

            // Nuevo: Agregamos evento al botón de ordenar
            document.getElementById("btnOrdenar").addEventListener("click", cambiarOrden);
            
            const categorias = ["todos", "deportiva", "naked", "cross", "niño"];
            const selectCategoria = document.getElementById("selectCategoria");

            categorias.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria;
                option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
                selectCategoria.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function mostrarProductos(productosMostrar) {
        const productosFiltrados = productosMostrar.filter(producto => {
            const precioCumple = producto.precio >= filtroPrecioMinimo && producto.precio <= filtroPrecioMaximo;
            const colorCumple = filtroColor === "todos" || producto.color.toLowerCase() === filtroColor;
            const categoriaCumple = filtroCategoria === "todos" || producto.categoria.toLowerCase() === filtroCategoria;

            return precioCumple && colorCumple && categoriaCumple;
        });

        // Nuevo: Ordenar productos
        const productosOrdenados = ordenarProductos(productosFiltrados);

        const indiceInicio = (paginaActual - 1) * productosPorPagina;
        const indiceFin = paginaActual * productosPorPagina;

        const productosPagina = productosOrdenados.slice(indiceInicio, indiceFin);

        let motosHTML = "";

        if (productosPagina.length === 0) {
            motosHTML = '<p>No se encontraron productos.</p>';
        } else {
            productosPagina.forEach(producto => {
                const ivaDecimal = producto.iva / 100;
                const precioConIva = producto.precio * (1 + ivaDecimal);

                motosHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card m-3">
                            <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.marca} ${producto.modelo}</h5>
                                <p class="card-text">Color: ${producto.color}</p>
                                <p class="card-text">Categoría: ${producto.categoria}</p>
                                <p class="card-text">Precio: €${producto.precio.toFixed(2)}</p>
                                <p class="card-text">IVA: €${(precioConIva - producto.precio).toFixed(2)}</p>
                                <p class="card-text">Precio + IVA: €${precioConIva.toFixed(2)}</p>
                                <a href="#" class="botonesPersonalizados btn-detalle">Detalles</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById("productos-container").innerHTML = motosHTML;

        document.getElementById("paginaActual").textContent = paginaActual;

        agregarEventosDetalles(productosPagina);
    }

    function ordenarProductos(productos) {
        // Nuevo: Ordenar productos por precio ascendente o descendente
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

            // Agregar evento al botón "Agregar al Carrito"
            const botonCarrito = document.createElement('button');
            botonCarrito.className = 'botonesPersonalizados btn-carrito';
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
    
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === producto.id);
    
        if (productoExistente) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            productoExistente.cantidad++;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            carrito.push({ ...producto, cantidad: 1 });
        }
    
        // Guardar el carrito actualizado en el almacenamiento local
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        
        // Si quiero abrir la pagina de carrito despues de añadir el producto
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
        filtroCategoria = document.getElementById("selectCategoria").value.toLowerCase(); // Nueva línea
    
        // Reinicia la paginación a la primera página al aplicar el filtro
        paginaActual = 1;
    
        mostrarProductos(productos);
    }
    
    function borrarFiltros() {
        // Restaura los valores de los filtros a sus valores predeterminados
        filtroPrecioMinimo = 0;
        filtroPrecioMaximo = Infinity;
        filtroColor = "todos";
        filtroCategoria = "todos"; // Nueva línea
    
        // Reinicia la paginación a la primera página al borrar los filtros
        paginaActual = 1;
    
        // Limpia los valores de los inputs y selects de filtros
        document.getElementById("inputPrecioMinimo").value = "";
        document.getElementById("inputPrecioMaximo").value = "";
        document.getElementById("selectColor").value = "todos";
        document.getElementById("selectCategoria").value = "todos"; // Nueva línea
    
        // Muestra todos los productos sin filtros
        mostrarProductos(productos);
    }
    
});
